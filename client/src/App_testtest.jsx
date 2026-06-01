import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const App = () =>{
  const [username, setUsername] = useState("TestUser");
  const [ws, setWs] = useState(null);

  const connect = () => { 
    const newWs = new WebSocket(`ws://localhost:2500?username=${username}`);
    newWs.onopen = () => console.log("Verbunden!");
    newWs.onmessage = (event) => console.log("Nachricht:", event.data);
    newWs.onerror = (err) => console.error("Fehler:", err);
    setWs(newWs);
  }





    

    /*
    sendJsonMessage({type:'JOIN_ROOM', payload: {roomId:' 123'}})

    const {sendJsonMessage} = useWebSocket(WS_URL, {
        onMessage: (event) => {
          const {type, payload} = JSON.parse(event.data);
    
          if(type === 'GAME_STATE'){
            setGameState(payload);
            setPage('lobby');
          }
          if (type === 'GAME_ERROR') {
            alert(payload.message); // später schöner machen
          }
        }
      })

        */

    return(
      <>
      <div>Test</div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>

      <button onClick={connect}>Verbinden</button>
      </>

    ) 
    
      
    



}

export default App;