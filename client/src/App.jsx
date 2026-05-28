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


const itemsFood = [
  {name: 'pizza', img: '../public/pizza.png'},
  {name: 'sushi', img: '../public/sushi.png'},
  {name: 'lasagne', img: '../public/lasagne.png'},
  {name: 'Suppe', img: '../public/suppe.png' },
  {name: 'franzbrötchen', img: '../public/franzbrötchen.png'},
  {name: 'schinken', img: '../public/schinken.png'},
  {name: 'curry', img: '../public/curry.png'},
  {name: 'karaage', img: '../public/karaage.png'},
  {name: 'udon', img: '../public/udon.png'},
  {name: 'sauerkraut', img: '../public/sauerkraut.png'},
]




function App() {


  const[currentIndex, setCurrentIndex] = useState(0);
  const currentItem = itemsFood[currentIndex];

  const nextRound = () => {
    console.log('nextRound called, index:', currentIndex);
    
    setCurrentIndex((prev) => prev +1);
  };



  return(
    <>
      <div className='main'>
        <div className='leftBlockContainer'>
          <ItemCard item={currentItem} onNext={nextRound}></ItemCard>
                
          <PickNumber></PickNumber>
        </div>
        
        <div className='tierlistBoard'>

          <NumberBlock rows={10}></NumberBlock>

          <PlayerColumn player={'max'} columns={10}></PlayerColumn>
          <PlayerColumn player={'bernd'} columns={10}></PlayerColumn>
          <PlayerColumn player={'günter'} columns={10}></PlayerColumn>
        </div>
      </div>
      
    </>
  )

}

export default App
