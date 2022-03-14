// Fix "perf death by a thousand cuts"
// http://localhost:3000/isolated/exercise/06.js

/*
Here we can also make HOC and return the state slice to needed the Cell components
also changing  the display name of the HOC  
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

const DogContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
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


function dogReducer(state,action){
    switch (action.type) {
        case 'TYPED_IN_DOG_INPUT': {
          return {...state, dogName: action.dogName}
        }
        
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
}

function DogProvider(props){
    const [state,dispatch] = React.useReducer(dogReducer,{
        dogName:''
    });
    const value = [state,dispatch]
    return <DogContext.Provider value={value} {...props}/>
}

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

// function Cell({row,column}){
//   const state = useAppState();
//   const cell = state.grid[row][column]
//   return <CellImpl cell={cell} row={row} column={column}></CellImpl>
// }

//6-4 -a making a HOC out for this and adding Cell whole functionality in this . 
//Also making the Cell code generic. 

function withStateSlice(Comp,slice){
  // function Cell({row,column}){
    const MemoComp = React.memo(Comp);
    function Wrapper(props){
    const state = useAppState();
    // const cell = state.grid[row][column]
    // return <CellImpl cell={cell} row={row} column={column}></CellImpl>
    
    //6-4-b- sending the state and props with slice and whoever will update the state 
    //they can do it anyway with this func so using state.grid[row][column] it in slice declaration
    return <MemoComp state={slice(state,props)} {...props}/>
  }
  Wrapper = React.memo(Wrapper);
  //6-4-e - making the custom HOC name instead of wrapper showing in react dev tools
  Wrapper.displayName = `withStateSlice(${Comp.displayName || Comp.name})`
  // return Wrapper;
  return React.memo(Wrapper)
}

/*6-5-a - What if we want to pass ref to Wrapper Comp along with  underlying Cell comp
*/
// function withStateSlice(Comp,slice){
//     const MemoComp = React.memo(Comp);
//     function Wrapper(props,ref){
//     const state = useAppState();
//     return <MemoComp ref={ref} state={slice(state,props)} {...props}/>
//   }
//   Wrapper = React.memo(Wrapper);
//   Wrapper.displayName = `withStateSlice(${Comp.displayName || Comp.name})`
//   return React.memo(React.forwardRef(Wrapper))
// }


//6-4-c- making the state assign to cell
// function CellImpl({cell,row, column}) {
  function Cell({state:cell,row, column}) {
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

//6-4-d- making the HOC and adding the Cell and state updating mechanisms 
Cell = withStateSlice(Cell,(state,{row,column})=>state.grid[row][column])

function DogNameInput() {
    const [state,dispatch] = useDogState();
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
        <div>
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