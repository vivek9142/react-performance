// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

// 4 - a1 - 🐨 import the useVirtual hook from react-virtual
import {useVirtual} from 'react-virtual'

import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// 💰 I made this for you, you'll need it later:
// 4- 8d using this getVirtualRowStyles func
const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  // 4 -a5 -🐨 accept listRef, virtualRows, totalHeight
  listRef,virtualRows,totalHeight
}) {
  return (
    // 4 -a6 -🐨 pass the listRef to the `getMenuProps` prop getter function below:
    // 💰  getMenuProps({ref: listRef})
    <ul {...getMenuProps({ref:listRef})}>
      {/* 🐨 add a li here with an inline style for the height set to the totalHeight */}
      {/*
        🦉 this is to ensure that the scrollable area of the <ul /> is the
        same height it would be if we were actually rendering everything
      */}


      {/* 4 - a7 -  instead of mapping the "items" we're going to map over the virtualRows */}
      {/* 🐨 swap `items` with `virtualRows` */}
      {/*
        💰 a virtual row is an object with the following properties:
        - index: you can use this to get the `item` via `items[index]`
        - size: set the "height" style to this value
        - start: this is how many pixels from the scrollTop this item should be
      */}

      {/* Commenting this prev normal one */}
      {/* {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
          // 🐨 pass a style prop, you can get the inline styles from getVirtualRowStyles()
          // make sure to pass an object with the size (the height of the row)
          // and start (where the row starts relative to the scrollTop of its container).
        > */}
          
          {/* 4 -a8 -a step - the list is not show the whole list so  creating 
          li with position abs and ul is relative so it will render whole list*/}
          <li style={{height:totalHeight}}/>
          {/* 4 -a 8 a step end */}
          {virtualRows.map(({index,size,start}) => {
            const item = items[index]
            return(
            <ListItem
            key={item.id}
            getItemProps={getItemProps}
            item={item}
            index={index}
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
            // 4- 8d -🐨 pass a style prop, you can get the inline styles from getVirtualRowStyles()
            // make sure to pass an object with the size (the height of the row)
            // and start (where the row starts relative to the scrollTop of its container).
            style={getVirtualRowStyles({size,start})}
          >
          {item.name}
        </ListItem>
            )
          })}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  // 🐨 4- 8b - accept the style prop
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          // 4- 8c -🐨 spread the incoming styles onto this inline style object
          ...style,
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])

  // 🐨 create a listRef with React.useRef
  // which will be used for the parentRef option you pass to useVirtual
  // and should be applied to the <ul /> for our menu. This is how react-virtual
  // knows how to scroll our items as the user scrolls.

  //4 - a2 creating a ref for useVirtual
  const listRef = React.useRef();

  // 4 -a3 - call useVirtual and pass configurations,
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef:listRef,
    estimateSize:React.useCallback(() => 20, []),
    overscan:10
  });

  // 🐨 call useVirtual with the following configuration options:
  // - size (the number of items)
  // - parentRef (the listRef you created above)
  // - estimateSize (a memoized callback function that returns the size for each item)
  //   💰 in our case, every item has the same size, so this will do: React.useCallback(() => 20, [])
  // - overscan (the number of additional rows to render outside the scrollable view)
  //   💰 You can play around with that number, but you probably don't need more than 10.
  // 🐨 you can set the return value of your useVirtual call to `rowVirtualizer`

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
    // we want to override Downshift's scrollIntoView functionality because
    // react-virtual will handle scrolling for us:
    // 🐨 set scrollIntoView to a "no-op" function
    // 💰 scrollIntoView: () => {},
    // 🐨 when the highlightedIndex changes, then tell react-virtual to scroll
    // to that index.
    // 💰 onHighlightedIndexChange: ({highlightedIndex}) => highlightedIndex !== -1 && rowVirtualizer.scrollToIndex(highlightedIndex),
        
    //4 8-e  - adding scroll behaviour to topmost up scroll go to bottom not to input 
        
        onHighlightedIndexChange : changes => {
          rowVirtualizer.scrollToIndex(changes.highlightedIndex)
        },
  
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
          // 4 -a4 - 🐨 pass the following props:
          listRef= {listRef}
          virtualRows= {rowVirtualizer.virtualItems}
          totalHeight={rowVirtualizer.totalSize}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
