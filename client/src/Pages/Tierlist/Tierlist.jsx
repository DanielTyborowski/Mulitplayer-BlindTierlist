import { useState, useEffect } from 'react'

import './Tierlist.css'

//components
import ItemCard from '../../components/ItemCard/ItemCard'
import PickNumber from '../../components/PickNumber/PickNumber'
import NumberBlock from '../../components/NumberBlock/NumberBlock'
import PlayerColumn from '../../components/PlayerColumn/PlayerColumn'
import EndScreen from '../../components/EndScreen/EndScreen'


function Tierlist({gameState, onNextRound, onSubmitPosition ,myId, onResetGame, onNavigate}) {

    const [selectedPosition, setSelectedPosition] = useState(null);
    const [items, setItems] = useState([]);

    const gs = gameState.gameState;
    const currentRound = gs.currentRound;

    console.log(gameState);

    useEffect(() => {
      if (gameState.pool) setItems(gameState.pool);

      
    }, [gameState.pool]);

    const takenPositions = Object.values(gs.placements[myId]??[])
      .map((item, i) => item !== null ? i:null)
      .filter(i => i !== null);

    const hasSubmitted = gs.submittedThisRound.includes(myId);

    const handleConfirm = () =>{
      if (selectedPosition === null || hasSubmitted)return;
      onSubmitPosition(selectedPosition, items[currentRound]);
      setSelectedPosition(null); 
    }

  return(
    <>
      <div className='main'>



        {/*Item + selector*/}
        <div className='leftBlockContainer'>
          
          {items?.length&&
            <ItemCard item={items[currentRound]} index={currentRound +1} totalRounds={gameState.gameState.totalRounds} ></ItemCard>
          }
          <PickNumber
                    selectedPosition={selectedPosition}
                    onSelect={hasSubmitted ? () => {} :setSelectedPosition}
                    onNext={handleConfirm}
                    onNextRound={onNextRound}
                    takenPositions={takenPositions}
                    gameState={gameState}
                    myId={myId}
                    hasSubmitted={hasSubmitted}
                />
        </div>
        



        {/*Tierlist*/}
        <div className='tierlistBoard' id='tierlist-result'>

          {/*Keine Funktion nur Deko*/}
          <NumberBlock rows={gameState.gameState.totalRounds}></NumberBlock>

          {/*Die Spieler Spalten
          Bekommen Info über wie viele Spieler und es werden jeweils die Items platziert*/}    
          {items?.length&&
         
           <div className='playerColumns'>
                    {gameState.players.map((player) => (
                        <PlayerColumn
                          key={player.id}
                          player={player.name}
                          placements={gs.placements[player.id] ?? Array(gs.totalRounds).fill(null)}
                          previewItem={items[gs.currentRound]}
                          previewPosition={player.id === myId ? selectedPosition : null}
                      />
                    ))}
                </div>
                }
            
        </div>
 
        {
          gs.phase === 'GAME_OVER'&&
        
        <EndScreen  onResetGame={onResetGame} gameState={gameState} myId={myId} onNavigate={onNavigate}></EndScreen>
        }
      </div>
      
    </>
  )

}

export default Tierlist
