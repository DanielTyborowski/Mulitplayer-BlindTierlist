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
//import { promises as fs } from 'fs';

import tierlistRouter from './routes/tierlists.js'




dotenv.config();

const port = process.env.port || 2500;

const server = express();
server.use(cors());
server.use(express.json());
server.use('/data', express.static(path.join('.', 'data')))
server.use('/tierlist', tierlistRouter);


const httpServer = createServer(server)
const wss = new WebSocketServer({server: httpServer})

await initDB();





const connections = {};
const users = {}; 

/*
const gameState = {
    rooms: {
        roomId: {
            id: 'roomId',
            tierlistId: 'tierlistId',
            round: 1,
            maxRounds: 10,
            votes: {
                playerId: position,
            },
            players: {},    
            host: 'playerId1'
        }
    }
}

*/



const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



const handleMessage = (uuid, message) => {
    const data = JSON.parse(message);
    const {type, payload} = data;
    const user = users[uuid];
    if (!user) return;

    if (type === 'CREATE_ROOM'){
        const { playerName, totalRounds, tierlistId} = payload;
        const code = generateCode();

        rooms[code] = {
            hostId: uuid,
            tierlistId,
            players: [{
                id: uuid,
                name: playerName,
                ws: connections[uuid],
                ranking: null
            }],
            gameState:{
                phase: 'LOBBY',
                currentRound: 1,
                totalRounds,
            }
        };


        user.state.roomId = code;
        user.state.isHost = true;


        connections[uuid].send(JSON.stringify({
            type: 'GAME_STATE',
            payload: {
                code, 
                hostID: uuid,
                players: [{id: uuid, name: playerName}],
                gameState: rooms[code].gameState,
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

        room.players.push({ id: uuid, name: playerName, ws: connections[uuid] });
        user.state.roomId = gameCode;
        console.log('username:', playerName, 'ist raum beigetreten'); 
        console.log('uuid:', uuid);

        // Allen im Raum den neuen State schicken
        room.players.forEach(({ ws, id }) => {
            ws.send(JSON.stringify({
                type: 'GAME_STATE',
                payload: {
                    code: gameCode,
                    hostId: room.hostId,
                    myId: id,
                    players: room.players.map(p => ({ id: p.id, name: p.name })),
                    gameState: room.gameState,
                }
            }));
        });
    }


    if (type === 'SUBMIT_RANKING') {
    const { ranking } = payload;
    const room = rooms[user.state.roomId];
    const player = room.players.find(p => p.id === uuid);
    
    player.ranking = ranking;

    // Prüfen ob alle abgestimmt haben
    const allSubmitted = room.players.every(p => p.ranking !== null);
    if (allSubmitted) {
        // Ergebnisse an alle schicken
        broadcast(room.code, {
            type: 'ROUND_RESULTS',
            payload: {
                rankings: room.players.map(p => ({ name: p.name, ranking: p.ranking }))
            }
        });

        // Rankings zurücksetzen für nächste Runde
        room.players.forEach(p => p.ranking = null);
    }
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
    console.log('username:', username, 'hat sich verbunden'); 
    console.log('uuid:', uuid); 

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
    console.log('users:', users);

    connection.on('message', (message) => handleMessage(uuid, message));
    connection.on('close', () => handleClose(uuid));

    
});








//Speichern des Spiels
const rooms = {}


const broadcast = (roomId, data) => {
    const room = rooms[roomId]
    if (!room) return;
    room.players.forEach(({ws}) =>{
        ws.send(JSON.stringify(data))
    })
}









const init = async () => {
    httpServer.listen(port, err => {
        if(err) console.log(err);
        else console.log(`Server läuft auf Port: ${port}`);
    })

};

init();





