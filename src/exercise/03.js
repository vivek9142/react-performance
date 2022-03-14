// React.memo for reducing unnecessary re-renders
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../filter-cities'
import {useForceRerender} from '../utils'

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
          // 3-c removing and updfating the props moving these values one bit higher in the tree
          // selectedItem={selectedItem}
          // highlightedIndex={highlightedIndex}
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}
//3-a add react.memo here will prevent rerenders
Menu = React.memo(Menu);
// 🐨 Memoize the Menu here using React.memo

//3-c here for shallow comparison we can sent only the primivative values which needs to be rerendered.
//we have selected item and is highlighted index values if we 
//create boolean values out of those and rerender them once they changes. also we can move these values
// bit higher in the tree and then pass those value as props.so by this it wqill rerender when some 
// condition  is satisfied for some child

function ListItem({
  getItemProps,
  item,
  index,
  //3-c removing this and adding below new lines
  // selectedItem,
  // highlightedIndex,
  //3-c 
  isSelected,
  isHighlighted,
  ...props
}) {
  //3-c commmenting 
  // const isSelected = selectedItem?.id === item.id
  // const isHighlighted = highlightedIndex === index
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
//3-a add react.memo here will prevent rerenders
// ListItem = React.memo(ListItem);
// 🐨 Memoize the ListItem here using React.memo

//3 - b- making the custom comparator function for rerender minimization
// ListItem = React.memo(ListItem,(prevProps,nextProps) =>{
//   // returning true will not rerender the component and false will rerender this component
  
//   if(prevProps.getItemProps !== nextProps.getItemProps) return false;
//   if(prevProps.items !== nextProps.items) return false;
//   if(prevProps.index !== nextProps.index) return false;
//   if(prevProps.selectedItem !== nextProps.selectedItem) return false;
//   // so this is highlighting the only index which is only hovered
//   if(prevProps.highlightedIndex !== nextProps.highlightedIndex){
//     const wasPreviouslyHighlighted = prevProps.highlightedIndex === prevProps.index;
//     const isNowHighlighted = nextProps.highlightedIndex === prevProps.index;
//     return wasPreviouslyHighlighted === isNowHighlighted;
//   }
// });

// 3-c normal react.memo - adopting react default shallow comparison behaviour
ListItem = React.memo(ListItem);

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const allItems = React.useMemo(()=> getItems(inputValue),[inputValue]);
  
  const items = allItems.slice(0, 100)

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

/*
eslint
  no-func-assign: 0,
*/
