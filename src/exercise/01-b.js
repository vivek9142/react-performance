// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 💣 remove this import
// import Globe from '../globe'

//use of webpack magic comment we can prefetch once the browser is not 
//accessing or retreiving any resources
//there are certain implication to this i.e, 
//if we are using any other server webpack will give errors here but with 
//front end apps it will not show errors

                            // Webpack magic comment
const loadGlobe = React.lazy(/* webpackPrefetch:true*/ '../globe');



const Globe = React.lazy(loadGlobe);


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
