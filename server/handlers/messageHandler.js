import { users } from '../state/store.js';
import { handleCreateRoom, handleJoinRoom, handleResetGame } from './roomHandlers.js';
import { handleStartGame, handleSubmitPosition, handleNextRound } from './gameHandlers.js';

export const handleMessage = async (uuid, message) => {
    const { type, payload } = JSON.parse(message);
    if (!users[uuid]) return;

    switch (type) {
        case 'CREATE_ROOM':      return await handleCreateRoom(uuid, payload);
        case 'JOIN_ROOM':        return handleJoinRoom(uuid, payload);
        case 'RESET_GAME':       return handleResetGame(uuid, payload);
        case 'START_GAME':       return handleStartGame(uuid);
        case 'SUBMIT_POSITION':  return handleSubmitPosition(uuid, payload);
        case 'NEXT_ROUND':       return handleNextRound(uuid);
        default: console.warn('Unbekannter Typ:', type);
    }
};