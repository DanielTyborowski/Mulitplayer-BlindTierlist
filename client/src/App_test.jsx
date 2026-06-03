import { useState } from 'react'
import './App.css'
import Home from './Pages/home'
import CreateRoom from './Pages/createRoom'
import JoinLobby from './Pages/joinLobby'
import useWebSocket from 'react-use-websocket'
import Lobby from './Pages/lobby';
import TestPage from './Pages/testPage'
import Tierlist from './Pages/tierlist';
import CreateTierlist from './Pages/CreateTierlist/CreateTierlist'

const WS_URL = 'ws://localhost:2500';

const App = () => {


  const [page, setPage] = useState('home');
  const [username, setUsername] = useState('');
  const [gameState, setGameState] = useState('null');
  const [myId, setMyId] = useState('');




  const {sendJsonMessage} = useWebSocket.default(WS_URL, {
    onMessage: (event) => {
      
      const {type, payload} = JSON.parse(event.data);

 

      if(type === 'GAME_STATE'){
       
        setGameState(payload);
        if(payload.myId) setMyId(payload.myId);


        switch(payload.gameState.phase){
          case 'LOBBY':
            setPage('lobby');
            break;

          case 'TIERLIST':
            setPage ('tierlist');
            break;

          case 'GAME_START':
            setPage ('tierlist');
            break;

           
        }
        
      }

      if (type === 'GAME_ERROR') {
        alert(payload.message); // später schöner machen
      }
      
    }
  })


  const handleNavigate = (target, name) =>{
    setUsername(name);
    setPage(target);
  }


  const handleCreateRoom=(name, rounds, selectedTierlist, selectMode) =>{
    sendJsonMessage({type: 'CREATE_ROOM' , payload : {playerName: name, totalRounds: rounds, tierlistId: selectedTierlist, mode: selectMode }});
  }


  const handleJoinRoom = (name, code) => {
    sendJsonMessage({type: 'JOIN_ROOM', payload: {playerName: name, gameCode: code}});
  }

  const handleNextRound = () => {
    console.log('handleNextRound called');
    sendJsonMessage({ type: 'NEXT_ROUND', payload: {} });
  };


  const handleStartGame = (name, code) => {
    sendJsonMessage({type: 'START_GAME', payload: {playerName: name, gameCode: code}});
  }

  const nextRound = () => {
    sendJsonMessage({type: 'NEXT_ROUND', payload: {gameCode: gameState.code}});
  }

  const handleSelect = (position) => {
    sendJsonMessage({type: 'SELECT_POSITION', payload: {gameCode: gameState.code, position}});
  }

  const handleReady = () => {
    sendJsonMessage({type: 'PLAYER_READY', payload: {gameCode: gameState.code}});
  }


  const handleSubmitPosition = (position, item) =>{
    sendJsonMessage({type: 'SUBMIT_POSITION', payload: {position, item}})
  }

  const handleResetGame = () => {
    sendJsonMessage({type: 'RESET_GAME', payload: {gameCode: gameState.code}});
  }


  if (page === 'home') return <Home onNavigate={handleNavigate} />;
  if (page === 'create') return <CreateRoom username={username} onCreateRoom={handleCreateRoom} onNavigate={handleNavigate} onBack={() => setPage('home')} />;
  if (page === 'join') return <JoinLobby username={username} onJoinRoom={handleJoinRoom} onBack={() => setPage('home')} />;
  if (page === 'lobby') return <Lobby username={username} gameState={gameState} onNavigate={handleNavigate} onStartGame={handleStartGame} />;
  if (page === 'tierlist') return <Tierlist username={username} myId={myId} gameState={gameState} onSubmitPosition={handleSubmitPosition} onNextRound={handleNextRound} onResetGame={handleResetGame} onNavigate={handleNavigate}/>;
  if (page === 'createTierlist') return <CreateTierlist onBack={() => setPage('home')}  />;
  
  if (page === 'testPage') return <TestPage></TestPage>


}

export default App
