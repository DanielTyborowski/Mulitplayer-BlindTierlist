import { useState, useEffect } from 'react'

import '../App.css'

//components
import ItemCard from '../components/ItemCard/ItemCard'
import PickNumber from '../components/PickNumber/PickNumber'
import NumberBlock from '../components/NumberBlock/NumberBlock'
import PlayerColumn from '../components/PlayerColumn/PlayerColumn'




function Tierlist({gameState, onNextRound, onHandleSelect, onHandleReady,myId}) {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [items, setItems] = useState([]);
    const [gameOver, setGameOver] = useState(false);



    const players = gameState.players;
    const totalRounds = gameState.gameState?.totalRounds ?? 10;

    const [placement, setPlacement] = useState(
      Array(players.length).fill(null).map(() => Array(totalRounds).fill(null))
    )

    useEffect(() => {
      console.log('GameState:',gameState)
      fetch(`http://localhost:2500/tierlist/${gameState.tierlistId}`)
      .then(res => res.json())
      .then(doc => doc && setItems(doc.pool))
    },[])



    const handleSelect = (position) => {
        setSelectedPosition(position);

    };



    
    const nextRound = () => {

        if (selectedPosition === null) return;
     
        const newPlacement = placement.map((playerSlots) => {
            const updated = [...playerSlots];
            updated[selectedPosition] = items[currentItemIndex];
            return updated;
        });

        setPlacement(newPlacement);
        setSelectedPosition(null);

        //verhindert abbruch
        if (currentItemIndex >= items.length-1) {
            setGameOver(true);
            sendMessage('SUBMIT_RANKING', { ranking: newPlacement[0]})
        } else {
            setCurrentItemIndex((prev) => prev + 1);
        }
    };

    const takenPositions = placement[0]
    ?.map((item, i) => item !== null ? i : null)
    .filter((i) => i !== null) ?? [];




  if(gameOver) return <p>spiel vorbei</p>


    const pickRandomItems = (pool, count = 10) =>{
      return [...pool].sort(() => Math.random() -0.5).slice(0,count)
    }

    const getItems = (tierlistId) =>{
      const tierlist = tierlists[tierlistId];
      if (tierlist.type === 'random') return pickRandomItems(tierlist.pool, 10)
    }




   


    
    console.log(players)
    



  return(
    <>
      <div className='main'>



        {/*Item + selector*/}
        <div className='leftBlockContainer'>
          
          {items?.length&&
            <ItemCard item={items[currentItemIndex]} index={currentItemIndex +1} ></ItemCard>
          }
          <PickNumber
                    selectedPosition={selectedPosition}
                    onSelect={handleSelect}
                    onNext={nextRound}
                    takenPositions={takenPositions}
                    gameState={gameState}
                    myId={myId}
                />
        </div>
        



        {/*Tierlist*/}
        <div className='tierlistBoard'>

          {/*Keine Funktion nur Deko*/}
          <NumberBlock rows={items?.length}></NumberBlock>

          {/*Die Spieler Spalten
          Bekommen Info über wie viele Spieler und es werden jeweils die Items platziert*/}

      
          
          {items?.length&&

          
           <div className='playerColumns'>
                    {players.map((player, i) => (
                        <PlayerColumn
                          key={i}
                          player={player.name}
                          placements={placement[i]}
                          previewItem={items[currentItemIndex]}
                          previewPosition={selectedPosition}
                      />
                    ))}
                </div>
                }

                
        </div>


        <button onClick={()=>{
          console.log(gameState)
        }}>
          GameState log
        </button>


      </div>
      
    </>
  )

}

export default Tierlist
