import { rooms } from '../state/store.js';

export const broadcast = (roomId, data) => {
    const room = rooms[roomId];
    if (!room) return;
    room.players.forEach(({ ws }) => ws.send(JSON.stringify(data)));
};

export const getRoomPayload = (room, myId) => ({
    code: room.code,
    hostId: room.hostId,
    tierlistId: room.tierlistId,
    pool: room.pool,
    myId,
    players: room.players.map(p => ({ id: p.id, name: p.name })),
    gameState: room.gameState,
});