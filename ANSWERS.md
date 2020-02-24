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

