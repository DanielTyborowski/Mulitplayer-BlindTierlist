import './NumberBlock.css'


const NumberBlock = ({rows}) => {
    const colors = ['#ff0000', '#ff6f00', '#fff64c', '#75af48', 
        '#208000', '#00a2ff', '#003cff', '#390096', 
        '#6b0086', '#bd0032']

    
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