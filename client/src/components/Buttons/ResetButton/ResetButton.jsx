import './ResetButton.css';

const ResetButton = ({ onResetGame }) => {  
    return(
        <button className='reset-button' onClick={() => {  onResetGame(); }}>Reset</button>
    )
}


export default ResetButton;