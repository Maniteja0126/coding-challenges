import { useState } from 'react'
import BarChat from './components/BarChat'
import CHART_DATA from './ChatData'

import './App.css'

function App() {
  const [toggle, setToggle] = useState(false)

  return (
    <main className='container'>
     <button onClick={()=>setToggle(!toggle)}>Show Chat</button>
     {toggle ? <BarChat data={CHART_DATA}/> : null}
    </main>
  )
}

export default App
