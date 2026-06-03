import './RoundCounter.css';
import { useState } from 'react';


const RoundCounter = ({counter, maxRound}) => {
  


    return(
        <div className='roundCounterContainer'>
            <p className='playRound'>Runde</p>
            <p className='roundCounter'> {counter}/{maxRound}</p>
        </div>
        
    )
}


export default RoundCounter;