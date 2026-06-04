import { useState } from 'react'
import './App.css'
import Home from './Pages/Home/Home'
import CreateRoom from './Pages/CreateRoom/CreateRoom'
import JoinLobby from './Pages/JoinLobby/JoinLobby'
import useWebSocket from 'react-use-websocket'
import Lobby from './Pages/Lobby/Lobby';
import TestPage from './Pages/testPage'
import Tierlist from './Pages/Tierlist/Tierlist';
import CreateTierlist from './Pages/CreateTierlist/CreateTierlist'
import EditTierlist from './Pages/EditTierlist/EditTierlist'
import useGameSocket from './hooks/useGameSocket'


const App = () => {
  const [page, setPage] = useState('home');
  const [username, setUsername] = useState('');
  const [gameState, setGameState] = useState('null');
  const [myId, setMyId] = useState('');

  const {
    handleCreateRoom,
    handleJoinRoom,
    handleStartGame,
    handleNextRound,
    handleSelect,
    handleReady,
    handleSubmitPosition,
    handleResetGame,
  } = useGameSocket(setPage, setGameState, setMyId);

  const handleNavigate = (target, name) => {
    setUsername(name);
    setPage(target);
  };

  if (page === 'home')     return <Home onNavigate={handleNavigate} />;
  if (page === 'create')   return <CreateRoom username={username} onCreateRoom={handleCreateRoom} onNavigate={handleNavigate} onBack={() => setPage('home')} />;
  if (page === 'join')     return <JoinLobby username={username} onJoinRoom={handleJoinRoom} onBack={() => setPage('home')} />;
  if (page === 'lobby')    return <Lobby username={username} gameState={gameState} onNavigate={handleNavigate} onStartGame={handleStartGame} />;
  if (page === 'tierlist') return <Tierlist username={username} myId={myId} gameState={gameState} onSubmitPosition={handleSubmitPosition} onNextRound={handleNextRound} onResetGame={handleResetGame} onNavigate={handleNavigate} />;
  if (page === 'createTierlist') return <CreateTierlist onBack={() => setPage('home')} />;
  if (page === 'editTierlist')   return <EditTierlist onBack={() => setPage('home')} />;
};

export default App;