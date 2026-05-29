import ConfirmButton from '../Buttons/ConfirmButton/ConfirmButton';
import './PickNumber.css'


const PickNumber = ({selectedPosition, onSelect, onNext, takenPositions}) =>{

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
                        >
                            {i + 1}
                        </button>
                    );
                })}

            

            

          

        </div>
        <ConfirmButton onNext={onNext}></ConfirmButton>
        </>
    )

}

export default PickNumber;