import './NumberBlock.css'


const NumberBlock = ({rows}) => {
    return(
        <div className='numberBlockContainer'>
            <p>leer</p>
            {Array.from({length:rows}).map((_,i) =>(
                <p key={i} className='numberBlock'>{rows-i}</p>
            ))}


        </div>
    )
}

export default NumberBlock