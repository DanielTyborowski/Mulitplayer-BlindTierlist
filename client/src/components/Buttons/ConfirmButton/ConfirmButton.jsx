import './ConfirmButton.css'
import { useState } from 'react';


const ConfirmButton = ({ onNext}) => {

    

    return(
        <button  className='confirmButton' onClick={onNext}>
            Confirm
        </button>
    )
}


export default ConfirmButton;