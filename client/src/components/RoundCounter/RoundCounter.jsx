import './RoundCounter.css';
import { useState } from 'react';


const RoundCounter = ({onNext}) => {
    const[counter, setCounter] = useState(1);

    const counterUpdate = () =>{
        console.log('button clicked, onNext:', onNext); // ← richtiges Log
        setCounter(counter +1);
        if (onNext) onNext();
    }


    return(
        <div className='roundCounterContainer'>
            <p className='playRound'>Runde</p>
            <p className='roundCounter'>{counter}/10</p>
            <button onClick={counterUpdate}>P</button>
        </div>
        
    )
}


export default RoundCounter;