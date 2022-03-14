// Production performance monitoring
// http://localhost:3000/isolated/exercise/07.js

import * as React from 'react'
// 🐨 you're going to need the reportProfile function
// 💰 here, let me help you with that...

/*
7-1- sending the re-render data to console or backend
7-2- sending the tracing data ex-intraction data to use console or backend - 
this will also show in profiled interactions in chrome dev tools 
*/ 

//7-1-a importing report profile
import reportProfile from '../report-profile'

//7-2-a import tracing api 
import {unstable_trace as trace} from 'scheduler/tracing';

function Counter() {
  const [count, setCount] = React.useState(0)
  
  //7-2-b- call trace api
  //const increment = () => setCount(c => c + 1);
  const increment = ()=> trace('click',performance.now(),() => setCount(c => c + 1));

  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      {/*
      🐨 //7-1-b Wrap this div in a React.Profiler component
      give it the ID of "counter" and pass reportProfile
      to the onRender prop.
      */}
      <React.Profiler id='counter' onRender={reportProfile}>
      <div>
        Profiled counter
        <Counter />
      </div>
      </React.Profiler>
      <div>
        Unprofiled counter
        <Counter />
      </div>
    </div>
  )
}

export default App
