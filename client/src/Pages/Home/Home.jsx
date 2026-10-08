import './Home.css'
import {useState } from 'react';

const Home = ({ onNavigate }) => {


    const [username, setUsername] = useState('');
    const [error, setError] = useState('');


    const handleNavigate = (target) =>{
        if (username.trim() === '') {
            setError('Please insert your name');
            return;
        }
        onNavigate(target, username.trim());
    }

    return (
        <>
            <div className="home-container">
                <h1>Multiplayer Blind Tierlist Maker!</h1>
                <input
                    className='nameInput'
                    type='text'
                    placeholder='your Name' 
                    value={username}
                    onChange={(e) => {setUsername(e.target.value); setError('')}}
                ></input>
                {error && <p className="home-error">{error}</p>}

                <div className="home-button-container">




                   
                    <button onClick={() => handleNavigate('create')}>Create Game</button>
                    <button onClick={() => handleNavigate('join')}>Join Game</button>
                </div>
                <div className="home-divider" />

                <div className='edit-button-container'>
                    <button className='create-tierlist-button' onClick={() => onNavigate('createTierlist')}>Create Tierlist</button>
                    <button className='edit-tierlist-button' onClick={() => onNavigate('editTierlist')}>Edit Tierlists</button>
                </div>
            </div>
            
        </>  
    )
}
export default Home