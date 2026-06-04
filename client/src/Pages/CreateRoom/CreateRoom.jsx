
import './CreateRoom.css'

import BackButton from '../../components/Buttons/BackButton/BackButton';

import { useEffect, useState } from "react";

const CreateRoom = ({username, onCreateRoom,onNavigate, onBack}) =>{
    const [rounds, setRounds] = useState(10);
    const [maxPlayer, setMaxPlayer] =useState(4);
    const [selectMode, setSelectMode] = useState('random');


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
                <div className='create-room-panel'>
                    <h2 className='create-room-title'>Raum erstellen</h2>
                    <p>Spieler: <strong>{username}</strong></p>

                    <label>Runden</label>
                    <select value={rounds} onChange={(e) => setRounds(Number(e.target.value))}>
                        <option value={5}>5 Runde</option>
                        <option value={10}>10 Runden</option>
                    </select>


                    <label>Tierlist</label>
                    <select value={selectedTierlist} onChange={(e) => setSelectedTierlist(e.target.value)}>
                    {tierlists.map(tl => (
                        <option key={tl._id} value={tl._id}>{tl.name}</option>
                    ))}
                    </select>

                    <label>Modus</label>
                    <select value={selectMode} onChange={(e) => setSelectMode(e.target.value)}>
                        <option value={'random'}>Random</option>
                        <option value={'inOrder'}>In Order</option>
        

                    </select>
                    

                    <div className="create-room-button-container">
                        <button className='create-room-button' onClick={() => {
                            onCreateRoom(username, rounds, selectedTierlist, selectMode )
                            onNavigate('lobby')
                        }}
                        >Raum erstellen</button>
                        <BackButton onBack={onBack}></BackButton>
                        
                    </div>
                </div>
            </div>
        );
}

export default CreateRoom;



