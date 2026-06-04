import './joinLobby.css'
import { useState } from "react"



const JoinLobby = ({ username, onJoinRoom, onBack }) => {


    const [code, setCode] = useState('');
    const [error, setError] = useState('');


    const handleJoin = () =>{
        if (!code.trim()) {
            setError('Bitte gib einen Raum-Code ein');
            return;
        }
        onJoinRoom(username, code.trim().toUpperCase());
    }



    return (
        <div className='join-room-container'>
            <div className='join-room-panel'>
                <h2>Spiel beitreten</h2>
                <p>Spieler: <strong>{username}</strong></p>

                <input
                    type='text'
                    placeholder='Raum-Code'
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                    maxLength={6}
                />
                {error && <p className='error'>{error}</p>}

                <div className='button-container'>
                    <button onClick={handleJoin}>Beitreten</button>
                    <button onClick={onBack}>Zurück</button>
                </div>
            </div>
        </div>
    );
}

export default JoinLobby