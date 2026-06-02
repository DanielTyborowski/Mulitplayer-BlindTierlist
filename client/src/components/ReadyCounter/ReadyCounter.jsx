import './ReadyCounter.css'

const ReadyCounter = ({readyCount, totalPlayers}) => {
    const bg = readyCount === 0 ? '#2e2840'
             : readyCount === totalPlayers ? '#3b6d11'
             : '#854f0b';

    return(
        <div className="readyCounter" style={{ backgroundColor: bg }}>  
            {readyCount} / {totalPlayers} ready
        </div>
    )
}

export default ReadyCounter;