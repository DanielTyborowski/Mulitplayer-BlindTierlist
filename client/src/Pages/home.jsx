import './home.css'
import { use, useState } from 'react';

const Home = ({ onNavigate }) => {


    const [username, setUsername] = useState('');
    const [error, setError] = useState('');


    const handleNavigate = (target) =>{
        if (username.trim() === '') {
            alert('Bitte gib einen Benutzernamen ein.');
            return;
        }
        onNavigate(target, username.trim());
    }



    const handleCreate = () => {
        if (username.trim() === '') {
            alert('Bitte gib einen Benutzernamen ein.');
            return;
        }
        onCreateRoom(username.trim());
    }

    const handleJoin = () => {
        if(username.trim() === ''){
            alert('Bitte gib einen Benutzername ein.')
            return;
        }

    }

    return (
        <>
            <div className="home-container">
                <h1>Willkommen zum Multiplayer Blind Tierlist Maker!</h1>
                <input
                    className='nameInput'
                    type='text'
                    placeholder='Name eingeben' 
                    value={username}
                    onChange={(e) => {setUsername(e.target.value); setError('')}}
                ></input>
                {error && <p className="home-error">{error}</p>}

                <div className="home-button-container">




                   
                    <button onClick={() => handleNavigate('create')}>Spiel erstellen</button>
                    <button onClick={() => handleNavigate('join')}>Spiel beitreten</button>
                </div>

                <div className='edit-button-container'>
                    <button className='create-tierlist-button' onClick={() => handleNavigate('createTierlist')}>Create Tierlist</button>
                    <button className='edit-tierlist-button' onClick={() => handleNavigate('editTierlist')}>Edit Tierlists</button>
                </div>
            </div>
            
        </>  
    )
}
export default Home