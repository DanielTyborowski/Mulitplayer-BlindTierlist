import ConfirmButton from '../Buttons/ConfirmButton/ConfirmButton';
import NextRoundButton from '../Buttons/NextRoundButton/NextRoundButton';
import './PickNumber.css'
import ReadyCounter from '../ReadyCounter/ReadyCounter';


const PickNumber = ({selectedPosition, onSelect, onNext, onNextRound, takenPositions, gameState , myId}) =>{

    const isHost = !!myId && myId === gameState.hostId
    //const isHost = myId === gameState.hostId;


    console.log(myId)


    const colors = ['#ff33cf', '#ff8b33', '#fff533', '#33ff36', 
        '#33c5ff', '#3363ff', '#7433ff', '#036a30', 
        '#ff3a33', '#FFA833']

    return(
        <>
        <div className='pickNumberContainer'>
            {Array.from({ length: gameState.gameState.totalRounds }).map((_, i) => {
                    
                    const isTaken = takenPositions.includes(i);
                    const isSelected = selectedPosition === i;

                    return (





                        <button
                            key={i}
                            className={`numberBlock 
                                ${isSelected ? 'selected' : ''} 
                                ${isTaken ? 'taken' : ''}`}
                            onClick={() => !isTaken && onSelect(i)}
                            disabled={isTaken}
                            style={{ backgroundColor: colors[i] }}
                        >
                            {i + 1}
                        </button>
                    );
                })}

            

            

          

        </div>


        

        <ConfirmButton className="confirmButton" onNext={onNext}></ConfirmButton>
        <ReadyCounter
            readyCount={gameState.gameState.submittedThisRound.length}
            totalPlayers={gameState.players?.length}
        >
        </ReadyCounter>
        {isHost&&
            <>
            <NextRoundButton
                className="nextRoundButton"
                onNext={() =>{
                    console.log('onNextRound:', onNextRound);
                    onNextRound();
                }}
                disable={gameState.gameState.submittedThisRound.length < gameState.players?.length}
            ></NextRoundButton>
           
            </>

        }
        </>
    )

}

export default PickNumber;