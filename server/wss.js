import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { connections, users } from './state/store.js';
import { handleMessage } from './handlers/messageHandler.js';

export const initWss = (httpServer) => {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (connection, request) => {
        const url = new URL(request.url, 'http://localhost');
        const uuid = uuidv4();

        connections[uuid] = connection;
        users[uuid] = { username: url.searchParams.get('username'), state: { page: 'home', isHost: false, roomId: null, ready: false } };

        connection.send(JSON.stringify({ type: 'WELCOME', id: uuid }));
        connection.on('message', (msg) => handleMessage(uuid, msg));
        connection.on('close', () => { delete connections[uuid]; delete users[uuid]; });
    });
};