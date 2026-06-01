import { useState } from "react"

const createLobby = ({onBegin}) => {

    //const [lobby, setLobby] = useState(null);
    //const [currentUser, setCurrentUser] = useState(null);

    /*
    useEffect(() => {
        //Serveranfrage
        fetch('http://localhost:2500/lobby')
            .then(response => response.json())
            .then(data => setLobby(data));
    }, []);

    */



    const[username, setUsername] = useState('');


    /*
    if(!room) {
        return <div>Lade Lobby...</div>
    }
        */


    return (
        <div>
            <h1>Lobby erstellen</h1>
            <h1>hier kann man die tierliste auswählen</h1>

            <forum onSubmit={(e) =>{
                e.preventDefault()
                onSubmit(username)
            }}>
                <input placeholder='Anzahl Runden'></input>
                <input placeholder='Anzahl Spieler'></input>
                <input 
                    type="text"
                    value={username}
                    placeholder='Name'
                    onChange={(e) => {
                        setUsername(e.target.value)
                        console.log('Username is:', username);
                        
                    }}
                ></input>

            </forum>
   
            
            <h1>hier kann man die eigene tierliste erstellen</h1>
            <h1>Eigene Tierlist Daten hinzufügen</h1>

            
            
            <h2>Hier soll der Lobby Code angezeigt werden</h2>

            <h3>Spieler 1 von 4   laden</h3>
            <p>Player 1</p>
            <p>Player 2</p>

            <button onClick={onBegin}>Runde beginnen</button>
            
        </div>
    )
}

export default createLobby