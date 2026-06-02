import './BackButton.css'


import { useState } from 'react';



const BackButton = ({onBack}) =>{
    return(
        <button className='back-button' onClick={onBack}>Zurück</button>
    )
}


export default BackButton;