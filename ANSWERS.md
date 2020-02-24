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

## Moving cells

```js
function move(cell, row, col) {
  cell.style.transform = `translate(${col * 32}px,${row * 32}px)`
}
```

## Setting up

```js
function setUp(cells) {
	cells.forEach((cell, k) => {
  	const col = k % 4;
    const row = Math.floor((k - col) / 4)
    move(cell, row, col)
  })
}
```

## Random positions

```js
function setUp(cells) {
	const mapping = shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])

	cells.forEach((cell, idx) => {
  	const k = mapping[idx]
  	const col = k % 4;
    const row = Math.floor((k - col) / 4)
    move(cell, row, col)
  })
}

function shuffle(arr) {
	for (let i = 0; i < arr.length ; i++) {
  	const k = Math.floor(Math.random() * arr.length)
    const tmp = arr[i]
    arr[i] = arr[k]
    arr[k] = tmp
  }
  return arr
}
```

## Advanced styling

```css
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
  box-shadow: 0 0 1px 3px inset #8647, 0 8px 16px #000b, 0 0px 8px 4px #321e;
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
  clip-path: path('M176,76 h128 q24,0,24,24 v100 h-176 v-100 q0,-24,24,-24 Z');
}

/* Flex */

body {
  overflow: hidden;
  background: #def;
}

div.flex {
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  transition: opacity .5s, filter 1s, transform .5s;
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

div.flex.hide {
  opacity: 0;
  filter: blur(10px);
  transform: scale(.75);
}
```

## Promise

```js
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}
```

```js
const logoLoader = loadImage(LOGO)
const gridLoader = loadImage(LOGO)

Promise.all([logoLoader, gridLoader]).then(start)
```

## Solving the game

You can use the A-* algorithm with manhattan distance as an heuristic.
