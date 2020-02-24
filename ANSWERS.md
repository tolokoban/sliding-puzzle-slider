# Answers
## Adding DIVs

```js
function createCells() {
  const grid = document.getElementById('grid')
  const cells = []
  for (let i = 0; i < 15; i++) {
  	const cell = document.createElement('div')
    cell.textContent = i
    grid.appendChild(cell)
    cells.push(cell)
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

#grid {
  border: 2px solid #864;
  border-radius: 4px;
}

#grid::before {
  z-index: -1;
  content: ".";
  font-size: 0;
  position: absolute;
  border-radius: 24px;
  width: 176px;
  height: 176px;
  margin: -24px;
  padding: 0;
  background: linear-gradient(to top,#cba,#420);
}

#grid::after {
  z-index: 1;
  content: ".";
  font-size: 0;
  position: absolute;
  width: 376px;
  margin: 0;
  height: 176px; 
  transform: translate(-176px,-100px);
  border-radius: 100%;
  background: #fff6;
}
## Moving cells

```js
function move(cell, row, col) {
  cell.style.transform = `translate(${col * 32}px,${row * 32}px)`
}
```

