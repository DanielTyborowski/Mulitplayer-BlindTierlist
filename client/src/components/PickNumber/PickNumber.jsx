import ConfirmButton from '../Buttons/ConfirmButton/ConfirmButton';
import NextRoundButton from '../Buttons/NextRoundButton/NextRoundButton';
import './PickNumber.css'
import ReadyCounter from '../ReadyCounter/ReadyCounter';


const PickNumber = ({selectedPosition, onSelect, onNext, onNextRound, takenPositions, gameState , myId}) =>{

    const isHost = !!myId && myId === gameState.hostId



    console.log('pick number: ', myId)


    const colors = ['#ff0000', '#ff6f00', '#fff64c', '#75af48', 
        '#208000', '#00a2ff', '#003cff', '#390096', 
        '#6b0086', '#bd0032']


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
                            style={{ backgroundColor: colors[i],
                                        opacity: isTaken ? 0.2 : 1 }}
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