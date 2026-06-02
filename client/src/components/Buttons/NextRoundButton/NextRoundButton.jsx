import './NextRoundButton.css'
import { useState } from 'react';


const NextRoundButton = ({ onNext}) => {

    

    return(

        
        <button  className='nextRoundButton' onClick={onNext}>
            Next Round
        </button>
    )
}


export default NextRoundButton;