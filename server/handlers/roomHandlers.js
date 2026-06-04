import { connections, users, rooms } from '../state/store.js';
import generateCode  from '../utils/generateCode.js';
import { db } from '../db.js';

export const handleCreateRoom = async (uuid, payload) => {
    const { playerName, totalRounds, tierlistId, mode } = payload;
    const code = generateCode();
    const doc = await db.get(tierlistId);
    let pool = [...doc.pool];

    if (mode === 'random') {
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
    }

    rooms[code] = {
        hostId: uuid,
        tierlistId,
        pool,
        players: [{ id: uuid, name: playerName, ws: connections[uuid], ranking: null }],
        gameState: {
            phase: 'LOBBY',
            mode,
            currentRound: 0,
            totalRounds,
            placements: {},
            revealPlacements: {},
            submittedThisRound: [],
        }
    };

    users[uuid].state.roomId = code;
    users[uuid].state.isHost = true;

    connections[uuid].send(JSON.stringify({
        type: 'GAME_STATE',
        payload: { code, myId: uuid, pool, hostId: uuid, players: [{ id: uuid, name: playerName }], gameState: rooms[code].gameState, tierlistId }
    }));
};

export const handleJoinRoom = (uuid, payload) => {
    const { playerName, gameCode } = payload;
    const room = rooms[gameCode];

    if (!room) {
        connections[uuid].send(JSON.stringify({ type: 'GAME_ERROR', payload: { message: 'Raum nicht gefunden!' } }));
        return;
    }

    room.players.push({ id: uuid, name: playerName, ws: connections[uuid], isHost: false, ranking: null });
    users[uuid].state.roomId = gameCode;

    room.players.forEach(({ ws, id }) => {
        ws.send(JSON.stringify({
            type: 'GAME_STATE',
            payload: { code: gameCode, pool: room.pool, hostId: room.hostId, myId: id, players: room.players.map(p => ({ id: p.id, name: p.name })), gameState: room.gameState, tierlistId: room.tierlistId }
        }));
    });
};

export const handleResetGame = (uuid, payload) => {
    const { gameCode } = payload;
    const room = rooms[gameCode];
    if (!room || room.hostId !== uuid) return;

    room.gameState = { ...room.gameState, currentRound: 0, placements: {}, revealPlacements: {}, submittedThisRound: [], phase: 'GAME_START' };

    room.players.forEach(({ ws, id }) => {
        ws.send(JSON.stringify({
            type: 'GAME_STATE',
            payload: { pool: room.pool, code: gameCode, hostId: room.hostId, myId: id, players: room.players.map(p => ({ id: p.id, name: p.name })), gameState: room.gameState, tierlistId: room.tierlistId }
        }));
    });
};