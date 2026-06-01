import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://127.0.0.1:2500';
const {sendJsonMessage} = useWebSocket(WS_URL,{
    queryParams: {username}
})

 const {sendJsonMessage} = useWebSocket.default(WS_URL, {
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

const socket = {
    send: (type, payload) =>  sendJsonMessage({type, payload}),
    createRoom: (playerName, totalRounds) => sendJsonMessage({type: 'CREATE_ROOM' , payload : {playerName, totalRounds}}),
    joinRoom: (playerName, gameCode) => sendJsonMessage({type: 'JOIN_ROOM', payload: {playerName, gameCode}})
    

}


export default socket;