import { useState } from 'react';
import './PlayerColumn.css'

const PlayerColumn = ({player,columns}) => {

    const [slots, setSlots] = useState(Array(columns).fill(null))
    
    return(
        <div className='playerColumnContainer'>
            <h2>{player}</h2>

            <div className='slots'>
                {slots.map((item, i) => (
                    <div key={i} className='slot'>
                        {item ? (
                            <img src = {item} />
                        ) : (
                            <span>leer</span>
                        )}
                    </div>
                ))}

            </div>


        </div>
    )
}

export default PlayerColumn;