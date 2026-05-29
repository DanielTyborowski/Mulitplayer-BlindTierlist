import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Home from './Pages/home.jsx'
import Waiting from './Pages/waiting.jsx'
import Tierlist from './Pages/tierlist.jsx'



function App() {


  const [page, setPage] = useState('home');

  if (page === 'home') return <Home onStart={() => setPage('waiting')} />
  if (page === 'waiting') return <Waiting onBegin={() => setPage('tierlist')} />
  if (page === 'tierlist') return <Tierlist />

}

export default App
