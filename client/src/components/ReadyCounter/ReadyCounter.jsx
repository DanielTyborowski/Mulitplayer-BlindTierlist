

const ReadyCounter = ({readyCount, totalPlayers}) => {
    return(
        <div className="readyCounter">  
            {readyCount} / {totalPlayers} ready
        </div>
    )
}

export default ReadyCounter;