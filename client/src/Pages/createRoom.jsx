import { useEffect, useState } from "react";

const CreateRoom = ({username, onCreateRoom,onNavigate, onBack}) =>{
    const [rounds, setRounds] = useState(10);
    const [maxPlayer, setMaxPlayer] =useState(4);
   


    const [tierlists, setTierlists] = useState([]);
    const [selectedTierlist, setSelectedTierlist] = useState('');




    useEffect(() => {
        fetch('http://localhost:2500/tierlist/')
        .then(res => res.json())
        .then(data => {
            setTierlists(data);
            setSelectedTierlist(data[0]?._id); // erstes als default

        });
    }, []);

    return (
            <div className="create-room-container">
                <h2>Raum erstellen</h2>
                <p>Spieler: <strong>{username}</strong></p>

                <label>Runden</label>
                <select value={rounds} onChange={(e) => setRounds(Number(e.target.value))}>
                    <option value={5}>5 Runde</option>
                    <option value={10}>10 Runden</option>
                </select>

                <label>Spieler</label>
                <select value={maxPlayer} onChange={(e) => setRounds(Number(e.target.value))}>
                    <option value={2}>2 Spieler</option>
                    <option value={3}>3 Spieler</option>
                    <option value={4}>4 Spieler</option>
                    <option value={5}>5 Spieler</option>

                </select>

                <label>Tierlist</label>
                <select value={selectedTierlist} onChange={(e) => setSelectedTierlist(e.target.value)}>
                {tierlists.map(tl => (
                    <option key={tl._id} value={tl._id}>{tl.name}</option>
                ))}
                </select>

            
                

                <div className="button-container">
                    <button onClick={() => {
                        onCreateRoom(username, rounds, selectedTierlist )
                        onNavigate('lobby')
                    }}
                    >Raum erstellen</button>
                    <button onClick={onBack}>Zurück</button>
                </div>
            </div>
        );
}

export default CreateRoom;



