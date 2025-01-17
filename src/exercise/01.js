// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 💣 remove this import
// import Globe from '../globe'

// 🐨 use React.lazy to create a Globe component which uses a dynamic import
// to get the Globe component from the '../globe' module.
const loadGlobe = ()=> import('../globe');


//3- using same function for accesing the same component
//so creating a common comp for import component

//1-React lazy - lazily load component need suspense comp 
//also with fallback component and always default comp are lazily loaded
// const Globe = React.lazy(()=> import('../globe'));

// 3-changes in Globe func
const Globe = React.lazy(loadGlobe);


// 2-lazily load when user focus or hovers the checkbox 
// function loadGlobe(){
//   return import('../globe');
// }

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  // 🐨 wrap the code below in a <React.Suspense /> component
  // with a fallback.
  // 💰 try putting it in a few different places and observe how that
  // impacts the user experience.
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          //2- load when user hover r focus checkbox
          onMouseEnter={loadGlobe}
          onFocus={loadGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      {/* 1-react lazy - added the fallbak ui */}
      <React.Suspense fallback={<h1>Loadinng...</h1>}>
      <div style={{width: 400, height: 400}}>
        {showGlobe ? <Globe /> : null}
      </div>
      </React.Suspense>
    </div>
  )
}
// 🦉 Note that if you're not on the isolated page, then you'll notice that this
// app actually already has a React.Suspense component higher up in the tree
// where this component is rendered, so you *could* just rely on that one.

export default App
