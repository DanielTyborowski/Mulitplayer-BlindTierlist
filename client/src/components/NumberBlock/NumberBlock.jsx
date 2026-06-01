import './NumberBlock.css'


const NumberBlock = ({rows}) => {
    const colors = ['#ff33cf', '#ff8b33', '#fff533', '#33ff36', 
        '#33c5ff', '#3363ff', '#7433ff', '#036a30', 
        '#ff3a33', '#FFA833']

    
    return(
        <div className='numberBlockContainer'>
            <p>leer</p>
            {Array.from({length:rows}).map((_,i) =>(
                <p key={i} className='numberBlock' style={{ backgroundColor: colors[i] }}>{i+1}</p>
            ))}


        </div>
    )
}

export default NumberBlock