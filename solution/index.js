"use strict"

window.addEventListener('DOMContentLoaded', (event) => {
    const LOGO = 'epfl.png'
    const GRID = 'grid.png'

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
        for (let i = 0; i < 15; i++) {
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
        const btnSolve = document.getElementById('btnSolve')
        btnSolve.addEventListener('click', () => {
            if (tasks.length > 0) return
            solve()
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
        let solution = findSolution()
        while (solution && typeof solution.move !== 'undefined') {
            tasks.unshift(solution.move)
            solution = solution.parent
        }
        console.info("tasks=", tasks)
        animSolving()
    }

    function animSolving() {
        if (tasks.length === 0) return
        const task = tasks.shift()
        for (const cell of cells) {
            if (task === cell.$col + 4 * cell.$row) {
                slideCell(cell)
                refresh()
                break
            }
        }
        window.setTimeout(animSolving, 300)
    }

    function findSolution() {
        const fringe = getFringe()
        console.info("fringe=", fringe)
        while (fringe.length > 0) {
            const board = findBestBoard(fringe)
            if (board.h === 0) {
                console.info("Solution=", board)
                return board
            }
            fringe.push(...board.getCandidates())
        }
    }

    function onCellClick(evt) {
        if (tasks.length > 0) return
        slideCell(evt.target)
        refresh()
    }

    function getFringe() {
        const grid = [-1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1]
        for (const cell of cells) {
            if (!cell) continue
            const idx = cell.$col + 4 * cell.$row
            grid[idx] = cell.$idx
        }

        const board = new Board(grid)
        return board.getCandidates()
    }
})


const ALPHABET = "*ABCDEFGHIJKLMNO"

class Board {
    constructor(parent, from, to) {
        if (Array.isArray(parent)) {
            this.parent = null
            this.grid = parent
            this.f = 0
        } else {
            this.parent = parent
            this.grid = parent.grid.slice()
            const tmp = this.grid[from]
            this.grid[from] = this.grid[to]
            this.grid[to] = tmp
            this.f = parent.f + 1
            this.move = from
        }
        this.h = computeHeuristic(this.grid)
        this.g = this.f + this.h
        this.key = this.grid.map(i => ALPHABET.charAt(i + 1)).join("")
    }

    getCandidates() {
        const grid = this.grid
        let hole = 0
        while (hole < 16) {
            if (grid[hole] === -1) break
            hole++
        }
        const col = hole & 3
        const row = hole >> 2

        const candidates = []
        if (col > 0) {
            const candidate = new Board(this, (col - 1) + 4 * row, hole)
            if (!hasLoop(this.parent, candidate.key)) {
                candidates.push(candidate)
            }
        }
        if (col < 3) {
            const candidate = new Board(this, (col + 1) + 4 * row, hole)
            if (!hasLoop(this.parent, candidate.key)) {
                candidates.push(candidate)
            }
        }
        if (row > 0) {
            const candidate = new Board(this, col + 4 * (row - 1), hole)
            if (!hasLoop(this.parent, candidate.key)) {
                candidates.push(candidate)
            }
        }
        if (row < 3) {
            const candidate = new Board(this, col + 4 * (row + 1), hole)
            if (!hasLoop(this.parent, candidate.key)) {
                candidates.push(candidate)
            }
        }

        return candidates
    }
}


function findBestBoard(boards) {
    let bestIndex = boards[0]
    let bestScore = boards[0].g

    for (let index = 1 ; index < boards.length ; index++) {
        const board = boards[index]
        if (board.g < bestScore) {
            bestIndex = index
            bestScore = board.g
        }
    }

    return boards.splice(bestIndex, 1)[0]
}


function hasLoop(board, key) {
    while (board) {
        if (board.key === key) return true
        board = board.parent
    }
    return false
}


function computeHeuristic(grid) {
    let h = 0
    for (let i=0 ; i<16 ; i++) {
        const cell = grid[i]
        if (i === cell || cell < 0) continue
        h = h + computeManhattanDistance(i, cell)
    }
    return h
}


function computeManhattanDistance(a, b) {
    const colA = a & 3
    const rowA = a >> 2
    const colB = b & 3
    const rowB = b >> 2
    return Math.abs(colA - colB) + Math.abs(rowA - rowB)
}
