import './BackHomeButton.css'


const BackHomeButton = ({onNavigat}) =>{

    return(
        <button className='back-home-button' onClick={()=>onNavigat('home')}>Home</button>
    )
}

export default BackHomeButton;