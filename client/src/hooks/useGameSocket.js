import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:2500';

const useGameSocket = (setPage, setGameState, setMyId) => {

  const { sendJsonMessage } = useWebSocket.default(WS_URL, {
    onMessage: (event) => {
      const { type, payload } = JSON.parse(event.data);

      if (type === 'GAME_STATE') {
        setGameState(payload);
        if (payload.myId) setMyId(payload.myId);

        switch (payload.gameState.phase) {
          case 'LOBBY':     setPage('lobby');    break;
          case 'TIERLIST':  setPage('tierlist'); break;
          case 'GAME_START': setPage('tierlist'); break;
        }
      }

      if (type === 'GAME_ERROR') {
        alert(payload.message);
      }
    }
  });

  const handleCreateRoom = (name, rounds, selectedTierlist, selectMode) =>
    sendJsonMessage({ type: 'CREATE_ROOM', payload: { playerName: name, totalRounds: rounds, tierlistId: selectedTierlist, mode: selectMode } });

  const handleJoinRoom = (name, code) =>
    sendJsonMessage({ type: 'JOIN_ROOM', payload: { playerName: name, gameCode: code } });

  const handleStartGame = (name, code) =>
    sendJsonMessage({ type: 'START_GAME', payload: { playerName: name, gameCode: code } });

  const handleNextRound = () =>
    sendJsonMessage({ type: 'NEXT_ROUND', payload: {} });

  const handleSelect = (position) =>
    sendJsonMessage({ type: 'SELECT_POSITION', payload: { position } });

  const handleReady = (gameCode) =>
    sendJsonMessage({ type: 'PLAYER_READY', payload: { gameCode } });

  const handleSubmitPosition = (position, item) =>
    sendJsonMessage({ type: 'SUBMIT_POSITION', payload: { position, item } });

  const handleResetGame = (gameCode) =>
    sendJsonMessage({ type: 'RESET_GAME', payload: { gameCode } });

  return {
    handleCreateRoom,
    handleJoinRoom,
    handleStartGame,
    handleNextRound,
    handleSelect,
    handleReady,
    handleSubmitPosition,
    handleResetGame,
  };
};

export default useGameSocket;