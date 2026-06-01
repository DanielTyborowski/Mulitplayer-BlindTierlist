import ConfirmButton from '../Buttons/ConfirmButton/ConfirmButton';
import './PickNumber.css'


const PickNumber = ({selectedPosition, onSelect, onNext, takenPositions}) =>{


    const colors = ['#ff33cf', '#ff8b33', '#fff533', '#33ff36', 
        '#33c5ff', '#3363ff', '#7433ff', '#036a30', 
        '#ff3a33', '#FFA833']

    return(
        <>
        <div className='pickNumberContainer'>
            {Array.from({ length: 10 }).map((_, i) => {
                    
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
        </>
    )

}

export default PickNumber;