import { useState } from 'react'

import './App.css'

import Home from './Pages/home'
import CreateRoom from './Pages/createRoom'
import JoinLobby from './Pages/joinLobby'
import useWebSocket from 'react-use-websocket'
import Lobby from './Pages/lobby';
import TestPage from './Pages/testPage'
import Tierlist from './Pages/tierlist';


const WS_URL = 'ws://localhost:2500';



const App = () => {


  const [page, setPage] = useState('home');
  const [username, setUsername] = useState('');
  const [gameState, setGameState] = useState('null');



  const {sendJsonMessage} = useWebSocket.default(WS_URL, {
    onMessage: (event) => {
      const {type, payload} = JSON.parse(event.data);

      if(type === 'GAME_STATE'){
        console.log(payload);
        setGameState(payload);
        setPage('lobby');
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


  const handleCreateRoom=(name, rounds, selectedTierlist) =>{
    sendJsonMessage({type: 'CREATE_ROOM' , payload : {playerName: name, totalRounds: rounds, tierlistId: selectedTierlist }});
  }


  const handleJoinRoom = (name, code) => {
    sendJsonMessage({type: 'JOIN_ROOM', payload: {playerName: name, gameCode: code}});
  }

  if (page === 'home') return <Home onNavigate={handleNavigate} />;
  if (page === 'create') return <CreateRoom username={username} onCreateRoom={handleCreateRoom} onNavigate={handleNavigate} onBack={() => setPage('home')} />;
  if (page === 'join') return <JoinLobby username={username} onJoinRoom={handleJoinRoom} onBack={() => setPage('home')} />;
  if (page === 'lobby') return <Lobby username={username} gameState={gameState} onNavigate={handleNavigate} />;
  if (page === 'tierlist') return <Tierlist username={username} gameState={gameState} ></Tierlist>
  
  
  if (page === 'testPage') return <TestPage></TestPage>




  /*
  if (page === 'home') return <Home onStart={() => setPage('createLobby')} />
  if (page === 'createLobby') return <CreateLobby onBegin={() => setPage('tierlist')} />
  if (page === 'tierlist') return <Tierlist />
  */
}

export default App
