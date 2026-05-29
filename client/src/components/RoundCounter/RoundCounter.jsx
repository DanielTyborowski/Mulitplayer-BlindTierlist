import './RoundCounter.css';
import { useState } from 'react';


const RoundCounter = ({counter}) => {
  


    return(
        <div className='roundCounterContainer'>
            <p className='playRound'>Runde</p>
            <p className='roundCounter'>{counter}/10</p>
        </div>
        
    )
}


export default RoundCounter;