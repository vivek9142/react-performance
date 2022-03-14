// Fix "perf death by a thousand cuts"
// http://localhost:3000/isolated/exercise/06.js

/*
Here we are resolving the same problem but we're not co-locating the state 
but we're keeping the global state

ig we want to keep dogname accessible to all components so how we will deal  with this prob
so now we now need to keep the global state sharing the global state here 
here the dogname is connected to the grid and grid is also connected to the dogname so we need to 
keep things in a way the components won't be updated inspite of sharing the same state

so here we can separate the context out so we dont have one context of all of our app and
separate the context based on logical domain. 

*/ 

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

//6 - 2-a creating the dogcontext 
const DogContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
    // 6 - 2- c ccopy the reducer to separate reducer and commenting it here 
    // case 'TYPED_IN_DOG_INPUT': {
    //   return {...state, dogName: action.dogName}
    // }
    case 'UPDATE_GRID_CELL': {
      return {...state, grid: updateGridCellState(state.grid, action)}
    }
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    // 💣 remove the dogName state because we're no longer managing that
    dogName: '',
    grid: initialGrid,
  })
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within the AppProvider')
  }
  return context
}

// 6 - 2- b create a dog Reducer and copy the reducer related to dog
function dogReducer(state,action){
    switch (action.type) {
        // we're no longer managing the dogName state in our reducer
        // 💣 remove this case
        case 'TYPED_IN_DOG_INPUT': {
          return {...state, dogName: action.dogName}
        }
        
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
}
// 6- 2 -e - creating the dogProvider
function DogProvider(props){
    const [state,dispatch] = React.useReducer(dogReducer,{
        dogName:''
    });
    const value = [state,dispatch]
    return <DogContext.Provider value={value} {...props}/>
}
// 6- 2 -f - creating the useDogState
function useDogState(){
    const context = React.useContext(DogContext);
    if(!context) throw new Error('useDogState must be used within the DogStateProvider');
    return context;
}
function Grid() {
  const dispatch = useAppDispatch()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => dispatch({type: 'UPDATE_GRID'})
  return (
    <AppGrid
      onUpdateGrid={updateGridData}
      rows={rows}
      handleRowsChange={setRows}
      columns={columns}
      handleColumnsChange={setColumns}
      Cell={Cell}
    />
  )
}
Grid = React.memo(Grid)

function Cell({row, column}) {
  const state = useAppState()
  const cell = state.grid[row][column]
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}
Cell = React.memo(Cell)

function DogNameInput() {
  // 🐨 replace the useAppState and useAppDispatch with a normal useState here
  // to manage the dogName locally within this component

  //   const state = useAppState()
//   const dispatch = useAppDispatch()

/* // 6- 2 -h - using the state dog from useDogState */
    const [state,dispatch] = useDogState();
  const {dogName} = state

  function handleChange(event) {
    const newDogName = event.target.value
    // 🐨 change this to call your state setter that you get from useState
    dispatch({type: 'TYPED_IN_DOG_INPUT', dogName: newDogName})
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="dogName">Dog Name</label>
      <input
        value={dogName}
        onChange={handleChange}
        id="dogName"
        placeholder="Toto"
      />
      {dogName ? (
        <div>
          <strong>{dogName}</strong>, I've a feeling we're not in Kansas anymore
        </div>
      ) : null}
    </form>
  )
}
function App() {
  const forceRerender = useForceRerender()
  /* previously */
    // <div className="grid-app">
    //   <button onClick={forceRerender}>force rerender</button>
    //   <AppProvider>
    //     <div>
    //       <DogNameInput />
    //       <Grid />
    //     </div>
    //   </AppProvider>
    // </div>
  return (
    
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
        <div>
    {/* // 6- 2 -g - co-locating the context provider as well */}
      <DogProvider>
          <DogNameInput />
      </DogProvider>  
      <AppProvider>
          <Grid />
      </AppProvider>
        </div>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/