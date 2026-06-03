import ResetButton from '../Buttons/ResetButton/ResetButton';


import './EndScreen.css';

const EndScreen = ({ gameState, onResetGame, myId }) => {
    const isHost = !!myId && myId === gameState.hostId

    console.log('END SCreen: ', myId)


    return(
        <div className='end-screen-container'>
            <h1>Runde Beendet</h1>

            {isHost&&
                <>

                    <button>Neue Runde</button>
                    <ResetButton onResetGame={onResetGame}></ResetButton>
                </>
            
            
            
            
            }
            
            

            <button>Save</button>
        </div>
    )
}


export default EndScreen;