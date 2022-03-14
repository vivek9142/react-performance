// useMemo for expensive calculations
// http://localhost:3000/isolated/exercise/02.js


/* 2-b - web worker
JS is a single threaded lang. all of the stuff loading data,etc
These all stuff is  performed one thing at a time it can't happen all at same time
so if loading time takes more than 16ms then the browser lock up and it can't update the screen
so it has that janky experience. so we can setup the web worker for doing all these hard and 
difficult steps so the main thread cannot do this hard and complicated work so this can offload this to this 
process in the browser.

the communication b/w web worker and js thread is async in nature 
*/ 

import * as React from 'react'
import {useCombobox} from '../use-combobox'

 /*2-b web worker commenting this using below line */ 
//import {getItems} from '../filter-cities'

import {getItems} from '../workerized-filter-cities'
//2-b web workercommenting this line and adding useAsync
// import {useForceRerender} from '../utils'

import {useAsync, useForceRerender} from '../utils'

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          highlightedIndex={highlightedIndex}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  highlightedIndex,
  ...props
}) {
  const isSelected = selectedItem?.id === item.id
  const isHighlighted = highlightedIndex === index
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('');

  //2- b web worker commenting this - before code - 
  //2-a using useMemo for reducing expensive calculations
  // const allItems = React.useMemo(()=> getItems(inputValue),[inputValue]);

  //added line following for web worker implementation
  const {data: allItems, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    //when our app mounts it will run getItems async func and when it resolves it will rerender 
    // due to useAsync func .
    run(getItems(inputValue))
  }, [inputValue, run]);


  const items = allItems.slice(0, 100);

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}

export default App
