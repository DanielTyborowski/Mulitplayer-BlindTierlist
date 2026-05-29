import './NumberBlock.css'


const NumberBlock = ({rows}) => {
    return(
        <div className='numberBlockContainer'>
            <p>leer</p>
            {Array.from({length:rows}).map((_,i) =>(
                <p key={i} className='numberBlock'>{i+1}</p>
            ))}


        </div>
    )
}

export default NumberBlock