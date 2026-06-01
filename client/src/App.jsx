import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'




//components
import ItemCard from './components/ItemCard/ItemCard'
import PickNumber from './components/PickNumber/PickNumber'
import NumberBlock from './components/NumberBlock/NumberBlock'
import PlayerColumn from './components/PlayerColumn/PlayerColumn'
import { useEffect } from 'react'




/*const tierlists = {
  food:{
    id: 'food',
    name: 'Food',
    type: 'random',
    pool:[
      {name: 'pizza', img: '../public/pizza.png'},
      {name: 'sushi', img: '../public/sushi.png'},
      {name: 'lasagne', img: '../public/lasagne.png'},
      {name: 'Suppe', img: '../public/suppe.png' },
      {name: 'franzbrötchen', img: '../public/franzbroetchen.png'},
      {name: 'schinken', img: '../public/schinken.png'},
      {name: 'curry', img: '../public/curry.png'},
      {name: 'karaage', img: '../public/karaage.png'},
      {name: 'udon', img: '../public/udon.png'},
      {name: 'sauerkraut', img: '../public/sauerkraut.png'},
    ]
  }
}*/

const rooms = {
    room1: {
      id: 'room1',
      tierlistId: 'food',
      round: 1,
      maxRounds: 10,
      votes: {},
      players: ['max', 'bernd', 'günter'],
      host: null
    }
}



const activeRoom = rooms['room1'];



function App() {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [selectedPosition, setSelectedPosition] = useState(null);



    


    const pickRandomItems = (pool, count = 10) =>{
      return [...pool].sort(() => Math.random() -0.5).slice(0,count)
    }

    const getItmes = (tierlistId) =>{
      const tierlist = tierlists[tierlistId];
      if (tierlist.type === 'random') return pickRandomItems(tierlist.pool, 10)
    }

    const activeRoom = rooms['room1'];


    //Serveranfrage
    const [items, setItems] = useState([]);

    useEffect(() => {
      fetch('http://localhost:2500/tierlists/tierlist:food')
      .then(res => res.json())
      .then(doc => setItems(doc.items))
    }), []

    //const [items] = useState(() => getItmes(activeRoom.tierlistId))

    

    // placement[playerIndex][slotIndex] = item
    const [placement, setPlacement] = useState(
        Array(activeRoom.players.length).fill(null).map(() => Array(10).fill(null))
    );

    const currentItem = items[currentItemIndex];

    const handleSelect = (position) => {
        setSelectedPosition(position);

 

    };

    const [gameOver, setGameOver] = useState(false);



    const nextRound = () => {

        if (selectedPosition === null) return;
     
        const newPlacement = placement.map((playerSlots) => {
            const updated = [...playerSlots];
            updated[selectedPosition] = currentItem;
            return updated;
        });

        setPlacement(newPlacement);
        setSelectedPosition(null);

        //verhindert abbruch
        if (currentItemIndex >= items.length-1) {
            setGameOver(true);
        } else {
            setCurrentItemIndex((prev) => prev + 1);
        }
    };

    const takenPositions = placement[0].map((item, i)=> item !==null ? i : null)
      .filter((i) => i !== null);

  return(
    <>
      <div className='main'>



        {/*Item + selector*/}
        <div className='leftBlockContainer'>
          <ItemCard item={currentItem} index={currentItemIndex +1} ></ItemCard>
                
          <PickNumber
                    selectedPosition={selectedPosition}
                    onSelect={handleSelect}
                    onNext={nextRound}
                    takenPositions={takenPositions}
                />
        </div>
        



        {/*Tierlist*/}
        <div className='tierlistBoard'>

          {/*Keine Funktion nur Deko*/}
          <NumberBlock rows={items.length}></NumberBlock>

          {/*Die Spieler Spalten
          Bekommen Info über wie viele Spieler und es werden jeweils die Items platziert*/}

           <div className='playerColumns'>
                    {activeRoom.players.map((player, i) => (
                        <PlayerColumn
                          key={i}
                          player={player}
                          placements={placement[i]}
                          previewItem={currentItem}
                          previewPosition={selectedPosition}
                      />
                    ))}
                </div>
        </div>





      </div>
      
    </>
  )

}

export default App
