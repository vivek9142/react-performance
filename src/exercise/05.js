// Optimize context value
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

const AppStateContext = React.createContext()

/*
The Grid is rerendering when any cell is clicked, so here memo finds that 
grid comes up with new value since  the whole state waschanges so it returns a new array
so it changes the whole context which is responsible for grid rerender.

here we can separate the dispatch value from context and memo since it never changes
*/ 
//5 - 2a creating the context for dispatch alone
const AppDispatchContext = React.createContext();

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
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
    dogName: '',
    grid: initialGrid,
  })
  // 🐨 memoize this value with React.useMemo
  // 5 -1 - useMemo since this array is responsible for rerenders and it is sent 
  //as new array every time it is rerendered
  // const value = [state, dispatch]

  // state is variable everytime and dispatch is static everytime but we can import it 
  //if we want it will be no difference
  // const value = React.useMemo(()=> [state, dispatch],[state])

  //5-2c- removing this since the values are directly used in providers
  // const value = React.useMemo(()=> [state, dispatch],[state])
  return (
    // 5 -2b - adding the app dispatch provider the order of these two provider is not mandatory
    <AppDispatchContext.Provider value = {dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}
// 5-2d - creating the error and context for appDispatch context
function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within the AppProvider')
  }
  return context
}


function Grid() {
  // const [, dispatch] = useAppState()
  // 5 - 2e - making the assignment with appDispatch func
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
  // const [state, dispatch] = useAppState()

  //5- 2f removing the dispatch and using AppDispatch context and for state also
  const state = useAppState()
  const dispatch = useAppDispatch()
  const cell = state.grid[row][column]
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
  // const [state, dispatch] = useAppState()

  //5 -2g making separate state,dispatch 
  const state = useAppState()
  const dispatch = useAppDispatch()
  const {dogName} = state

  function handleChange(event) {
    const newDogName = event.target.value
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
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <AppProvider>
        <div>
          <DogNameInput />
          <Grid />
        </div>
      </AppProvider>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/
