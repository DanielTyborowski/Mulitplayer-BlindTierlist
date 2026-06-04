import { users, rooms } from '../state/store.js';
import { broadcast } from '../utils/broadcast.js';

export const handleStartGame = (uuid) => {
    const room = rooms[users[uuid].state.roomId];
    if (!room) return;

    room.gameState.phase = 'GAME_START';
    broadcast(users[uuid].state.roomId, {
        type: 'GAME_STATE',
        payload: { pool: room.pool, code: users[uuid].state.roomId, hostId: room.hostId, players: room.players.map(p => ({ id: p.id, name: p.name })), gameState: room.gameState, tierlistId: room.tierlistId }
    });
};

export const handleSubmitPosition = (uuid, payload) => {
    const { position, item } = payload;
    const room = rooms[users[uuid].state.roomId];
    const gs = room.gameState;

    if (!gs.placements[uuid]) gs.placements[uuid] = Array(gs.totalRounds).fill(null);
    gs.placements[uuid][position] = item;
    if (!gs.submittedThisRound.includes(uuid)) gs.submittedThisRound.push(uuid);
    if (!gs.revealPlacements[uuid]) gs.revealPlacements[uuid] = Array(gs.totalRounds).fill(null);

    room.players.forEach(({ ws, id }) => {
        ws.send(JSON.stringify({
            type: 'GAME_STATE',
            payload: {
                pool: room.pool, code: users[uuid].state.roomId, hostId: room.hostId, myId: id,
                players: room.players.map(p => ({ id: p.id, name: p.name })),
                gameState: { ...gs, placements: { ...gs.revealedPlacements, [id]: gs.placements[id] ?? Array(gs.totalRounds).fill(null) } },
                tierlistId: room.tierlistId
            }
        }));
    });
};

export const handleNextRound = (uuid) => {
    const room = rooms[users[uuid].state.roomId];
    if (!room || room.hostId !== uuid) return;

    const gs = room.gameState;
    const allSubmitted = room.players.every(p => gs.submittedThisRound.includes(p.id));
    if (!allSubmitted) return;

    gs.revealedPlacements = JSON.parse(JSON.stringify(gs.placements));
    gs.submittedThisRound = [];
    gs.currentRound += 1;

    if (gs.currentRound >= gs.totalRounds) {
        gs.phase = 'GAME_OVER';
        gs.currentRound = gs.totalRounds - 1;
    }

    room.players.forEach(({ ws, id }) => {
        ws.send(JSON.stringify({
            type: 'GAME_STATE',
            payload: { pool: room.pool, code: users[uuid].state.roomId, hostId: room.hostId, myId: id, players: room.players.map(p => ({ id: p.id, name: p.name })), gameState: gs, tierlistId: room.tierlistId }
        }));
    });
};