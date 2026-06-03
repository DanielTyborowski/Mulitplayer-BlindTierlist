import BackHomeButton from '../Buttons/BackHomeButton/BackHomeButton';
import ResetButton from '../Buttons/ResetButton/ResetButton';
import SaveTierlist2PngButton from '../Buttons/SaveTierlist2PngButton/SaveTierlist2PngButton';


import './EndScreen.css';

const EndScreen = ({ gameState, onResetGame, myId, onNavigate}) => {
    const isHost = !!myId && myId === gameState.hostId

    console.log('END SCreen: ', myId)


    return(
        <div className='end-screen-container'>
            <h1>Runde Beendet</h1>
            {isHost&&
                <>
                <ResetButton onResetGame={onResetGame}></ResetButton>
                </>
            }
            <BackHomeButton onNavigat={onNavigate}></BackHomeButton>
            <SaveTierlist2PngButton onNavigate={onNavigate}></SaveTierlist2PngButton>
            
        </div>
    )
}


export default EndScreen;