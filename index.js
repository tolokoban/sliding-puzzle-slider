"use strict"

window.addEventListener('DOMContentLoaded', (event) => {
    const LOGO = 'https://raw.githubusercontent.com/tolokoban/sliding-puzzle-slider/master/epfl.png'
    const GRID = 'https://raw.githubusercontent.com/tolokoban/sliding-puzzle-slider/master/grid.png'

    const cells = createCells()

    // Cells to click in order to solve the puzzle.
    const tasks = []

    const logoLoader = loadImage(LOGO)
    const gridLoader = loadImage(LOGO)

    Promise.all([logoLoader, gridLoader]).then(start)

    function createCells() {
        const grid = document.getElementById('grid')
        const cells = []
        for (let i = 0; i < 15; i++) {
            const col = i % 4;
            const row = Math.floor((i - col) / 4)
            const cell = document.createElement('div')
            cell.addEventListener("click", onCellClick)
            cell.$col = col
            cell.$row = row
            cell.$idx = i
            cell.textContent = i
            grid.appendChild(cell)
            cells.push(cell)
        }
        return cells
    }

    /**
     * undefined -> Outside the grid.
     * null -> The hole.
     */
    function findCell(row, col) {
        if (row < 0 || col < 0 || row > 3 || col > 3) return undefined
        for (const cell of cells) {
            if (cell.$row === row && cell.$col === col) return cell
        }
        return null
    }

    /**
     * return [row, col]
     */
    function findHole() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (!findCell(row, col)) return [row, col]
            }
        }
    }

    function slideCell(cell) {
        const row = cell.$row
        const col = cell.$col
        const T = findCell(row - 1, col)
        if (T === null) {
            cell.$row--
            return
        }
        const B = findCell(row + 1, col)
        if (B === null) {
            cell.$row++
            return
        }
        const L = findCell(row, col - 1)
        if (L === null) {
            cell.$col--
            return
        }
        const R = findCell(row, col + 1)
        if (R === null) {
            cell.$col++
            return
        }
    }

    function getCandidates() {
        const [row, col] = findHole()
        const candidates = [
            findCell(row - 1, col),
            findCell(row + 1, col),
            findCell(row, col - 1),
            findCell(row, col + 1)
        ]
        return candidates.filter(c => c)
    }


    function move(cell, row, col) {
        cell.style.transform = `translate(${col * 32}px,${row * 32}px)`
        cell.$row = row
        cell.$col = col
    }

    function setUp() {
        cells.forEach((cell, k) => {
            const col = k % 4;
            const row = Math.floor((k - col) / 4)
            move(cell, row, col)
        })
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onload = () => resolve(img)
            img.onerror = reject
        })
    }

    function shuffle(arr) {
        for (let i = 0; i < 1000; i++) {
            const candidates = getCandidates()
            const candidate = candidates[Math.floor(Math.random() * candidates.length)]
            slideCell(candidate)
        }
        refresh()
    }

    function refresh() {
        cells.forEach(cell => move(cell, cell.$row, cell.$col))
    }

    function start() {
        const button = document.getElementById('button')
        button.addEventListener('click', () => {
            if (tasks.length > 0) return
            shuffle()
        })
        const grid = document.getElementById('grid')
        grid.style.background = `url(${GRID})`
        const root = document.getElementById("root")
        root.classList.remove("hide")
        window.setTimeout(() => {
            setUp(cells)
        }, 1000)
    }

    function computeHeuristic() {
        let score = 0
        for (let k = 0; k < cells.length; k++) {
            const col = i % 4;
            const row = Math.floor((i - col) / 4)
            const cell = cells[i]
            score += Math.abs(row - cell.$row)
            score += Math.abs(col - cell.$col)
        }
        return score
    }

    function solve() {
        tasks = []
        //const fringe
    }

    function onCellClick(evt) {
        if (tasks.length > 0) return
        slideCell(evt.target)
        refresh()
    }
})
