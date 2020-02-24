# Answers
## Adding DIVs

```js
function createCells() {
	const grid = document.getElementById('grid')
  const cells = []
  for (let i = 1; i < 16; i++) {
  	const cell = document.createElement('div')
    cell.textContent = i
    grid.appendChild(cell)
    cells.push(grid)
  }
  return cells
}
```

## Styling the grid

### Simple

```css
#grid {
  position: relative;
  width: 128px;
  height: 128px;
  margin: 32px;
  padding: 0;
  background: #bbb;
}

#grid > div {
  position: absolute;
  background: #ddd;
  width: 32px;
  height: 32px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: 2px 2px 1px #fff inset, -1px -1px 1px #000 inset;
}
```

### Transitions

```css
#grid > div {
  transition: transform .5s;
}
```


### Advanced

```css
#grid {
  border: 2px solid #864;
  border-radius: 4px;
}

#grid::before {
  content: ".";
  font-size: 0;
  position: absolute;
  border-radius: 24px;
  width: 176px;
  height: 176px;
  margin: -24px;
  padding: 0;
  background: #cba;
  box-shadow: 0 4px 16px #000a;
  z-index: -1;
}
```

## Moving cells

```js
move(cell, row, col) {

}
```

