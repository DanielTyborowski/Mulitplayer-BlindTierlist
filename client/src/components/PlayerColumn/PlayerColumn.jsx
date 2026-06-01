import { useState } from 'react';
import './PlayerColumn.css'

const PlayerColumn = ({ player, placements, previewItem, previewPosition }) => {

    
    return (
        <div className='playerColumnContainer'>
            <h2>{player}</h2>
            <div className='slots'>
                {placements.map((item, i) => {
                    const isPreview = previewPosition === i && !item;
                    const display = item ?? (isPreview ? previewItem : null);

                    return (
                        <div key={i} className={`slot ${isPreview ? 'preview' : ''}`}>
                            {display ? (
                                <img src={`http://localhost:2500${display.img}`} alt={display.name} />
                            ) : (
                                <span>leer</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerColumn;