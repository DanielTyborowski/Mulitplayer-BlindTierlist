'use strict';

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import cors from 'cors';
import nano from 'nano';
import dotenv from 'dotenv';
import { db, initDB } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import {parse} from 'url'

import multerfrom from 'multer';

//import { promises as fs } from 'fs';

import tierlistRouter from './routes/tierlists.js'
import uploadRouter from './routes/upload.js'


dotenv.config();

const port = process.env.port || 2500;

const server = express();
server.use(cors());
server.use(express.json());
server.use('/data', express.static(path.join('.', 'data')))
server.use('/tierlist', tierlistRouter);

server.use('/upload', uploadRouter);


const httpServer = createServer(server)
const wss = new WebSocketServer({server: httpServer})

await initDB();





const connections = {};
const users = {}; 
const rooms = {}


const broadcast = (roomId, data) => {
    const room = rooms[roomId]
    if (!room) return;
    room.players.forEach(({ws}) =>{
        ws.send(JSON.stringify(data))
    })
}


const getRoomPayload = (room, myId) => ({
    code: room.code,
    hostId: room.hostId,
    tierlistId: room.tierlistId,
    myId,
    players: room.players.map(p => ({ id: p.id, name: p.name })),
    gameState: room.gameState,
});



const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



const handleMessage = async (uuid, message) => {
    const data = JSON.parse(message);
    const {type, payload} = data;
    const user = users[uuid];
    if (!user) return;




    if (type === 'CREATE_ROOM'){
        const { playerName, totalRounds, tierlistId, mode} = payload;
        const code = generateCode();



        const doc = await db.get(tierlistId);
        let pool = [...doc.pool];

        if (mode === 'random'){
            for(let i = pool.length - 1 ; i > 0; i--){
                const j = Math.floor(Math.random() * (i +1));
                [pool[i], pool[j]] = [pool[j], pool[i]]
            }
        }

        rooms[code] = {

            hostId: uuid,
            tierlistId,
            pool,
            players: [{
                id: uuid,
                name: playerName,
                ws: connections[uuid],
                ranking: null
            }],
            gameState:{
                phase: 'LOBBY',
                mode: mode,
                currentRound: 0,
                totalRounds,
                placements: {},
                revealPlacements: {},
                submittedThisRound: [],
     
            }
        };


        user.state.roomId = code;
        user.state.isHost = true;


        connections[uuid].send(JSON.stringify({
            type: 'GAME_STATE',
            payload: {
                code, 
                myId: uuid,
                pool: rooms[code].pool,
                hostId: uuid,
                players: [{id: uuid, name: playerName, state: user.state}],
                gameState: rooms[code].gameState,
                tierlistId
            }
        }))
    }

    if (type === 'JOIN_ROOM') {
        const { playerName, gameCode } = payload;
        const room = rooms[gameCode];

        if (!room) {
            connections[uuid].send(JSON.stringify({
                type: 'GAME_ERROR',
                payload: { message: 'Raum nicht gefunden!' }
            }));
            return;
        }

        room.players.push({ id: uuid, name: playerName, ws: connections[uuid] , isHost: false, ranking: null});
        user.state.roomId = gameCode;


        // Allen im Raum den neuen State schicken
        room.players.forEach(({ ws, id }) => {
            ws.send(JSON.stringify({

                
                type: 'GAME_STATE',
                payload: {
                    code: gameCode,
                    pool: room.pool,
                    hostId: room.hostId,
                    myId: id,
                    players: room.players.map(p => ({ id: p.id, name: p.name  })),
                    gameState: room.gameState,
                    tierlistId: room.tierlistId
                }
 
            }));
            
            
        });
    }


    if (type === 'RESET_GAME') {
        const { gameCode } = payload;
        const room = rooms[gameCode];
        if (!room) return;
        if (room.hostId !== uuid) return;
        console.log('RESET_GAME received, hostId:', room.hostId, 'uuid:', uuid);
        room.gameState.currentRound = 0;
        room.gameState.placements = {};
        room.gameState.revealPlacements = {};
        room.gameState.submittedThisRound = [];
        room.gameState.phase = 'GAME_START';
        room.players.forEach(({ ws, id }) => {
            ws.send(JSON.stringify({
                type: 'GAME_STATE', 
                payload: {
                    pool: room.pool,
                    code: gameCode,
                    hostId: room.hostId,
                    myId: id,
                    players: room.players.map(p => ({ id: p.id, name: p.name })),
                    gameState: room.gameState,
                    tierlistId: room.tierlistId
                }
            }))
        });
    }


    
    if(type === 'START_GAME') {
       

        const room = rooms[user.state.roomId];

        if (!room) return;



         //if (room.hostId !== uuid) return;

        room.gameState.phase = 'GAME_START';
                 
        broadcast(user.state.roomId, {
        type: 'GAME_STATE',
        payload: {
            pool: room.pool,
            code: user.state.roomId,
            hostId: room.hostId,
            //myId: uuid,
            players: room.players.map(p => ({
                id: p.id,
                name: p.name
            })),
            gameState: room.gameState,
            tierlistId: room.tierlistId
        }
    });
    
    }


    if (type === 'SUBMIT_POSITION') {
        const {position, item} = payload;
        const room = rooms[user.state.roomId];
        const gs = room.gameState

        if(!gs.placements[uuid]){
            gs.placements[uuid] = Array (gs.totalRounds).fill(null);
        }
        gs.placements[uuid][position] = item;

        if(!gs.submittedThisRound.includes(uuid)){
            gs.submittedThisRound.push(uuid);
        }


        if(!gs.revealPlacements[uuid]){
            gs.revealPlacements[uuid] = Array (gs.totalRounds).fill(null);
        }

        room.players.forEach(({ws, id}) => {
        ws.send(JSON.stringify({
            type: 'GAME_STATE',
            payload: {
                pool: room.pool,
                code: user.state.roomId,
                hostId: room.hostId,
                myId: id,
                players: room.players.map(p => ({ id: p.id, name: p.name})),
                // eigene echten Daten + fremde nur revealed
                gameState: {
                    ...gs,
                    placements: {
                        ...gs.revealedPlacements,
                        [id]: gs.placements[id] ?? Array(gs.totalRounds).fill(null)
                    }
                },
                tierlistId: room.tierlistId
            }
        }));
    });

    }


    if(type === 'NEXT_ROUND'){
            
            const room = rooms[user.state.roomId];
            console.log('NEXT_ROUND received, hostId:', room.hostId, 'uuid:', uuid);
            if (room.hostId !== uuid) return


            const gs = room.gameState;
            const allSubmitted = room.players.every(p => gs.submittedThisRound.includes(p.id));
             if (!allSubmitted) return;

             gs.revealedPlacements = JSON.parse(JSON.stringify(gs.placements));

            gs.currentRound += 1;
            gs.submittedThisRound = [];

            if (gs.currentRound >= gs.totalRounds) {
                gs.phase = 'GAME_OVER';
                gs.currentRound = gs.totalRounds -1;
            } else{
                

            }

            room.players.forEach(({ ws, id }) => {
                ws.send(JSON.stringify({
                    type: 'GAME_STATE',
                    payload: {
                        pool: room.pool,
                        code: user.state.roomId,
                        hostId: room.hostId,
                        myId: id,
                        players: room.players.map(p => ({ id: p.id, name: p.name })),
                        gameState: gs,
                        tierlistId: room.tierlistId
                    }
                }));
            });
        }
    


    



}

const handleClose = (uuid) => {
    delete connections[uuid];
    delete users[uuid];
}

wss.on('connection', (connection, request) => {
    const url = new URL(request.url, 'http://localhost');
    const username = url.searchParams.get('username');
    const uuid = uuidv4();
    //console.log('username:', username, 'hat sich verbunden'); 
    //console.log('uuid:', uuid); 

    connections[uuid] = connection;

    users[uuid] = {
        username: username,
        state: {
            page: 'home',
            isHost: false,
            roomId: null,
            ready: false,
        }
    }


    connection.send(JSON.stringify({
        type: 'WELCOME',
            id: uuid       
    }))
    console.log(uuid)
    

    connection.on('message', (message) => handleMessage(uuid, message));
    connection.on('close', () => handleClose(uuid));

    
});


const init = async () => {
    httpServer.listen(port, err => {
        if(err) console.log(err);
        else console.log(`Server läuft auf Port: ${port}`);
    })

};

init();





