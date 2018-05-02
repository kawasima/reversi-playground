export function nextTurn(turn) {
  switch (turn) {
  case 'W': return 'B'
  case 'B': return 'W'
  default: throw new Error(`Unknown turn: ${turn}`)
  }
}

export function drop(turn, x, y, board) {
  let current = board.map((row, i) => row.map((s, j) => (i==y && j==x) ? turn : s))
  for (let [dx, dy] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
    const next = [...current.map(row => [...row])]
    let cx = x + dx, cy = y + dy
    let sandwitched = false
    while (cx >= 0 && cy >= 0 && cx <= 7 && cy <= 7) {
      if (next[cy][cx] === turn && sandwitched) {
        current = next
        break
      }

      if ((turn === 'W' && next[cy][cx] === 'B') || (turn === 'B' && next[cy][cx] === 'W')) {
        next[cy][cx] = turn
        sandwitched = true
      } else {
        break
      }

      cx += dx
      cy += dy
    }
  }
  return current
}

export function canDrop(turn, x, y, board) {
  if (board[y][x]) return false
  for (let [dx, dy] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
    let cx = x + dx, cy = y + dy
    let sandwitched = false
    while (cx >= 0 && cy >= 0 && cx <= 7 && cy <= 7) {
      if (board[cy][cx] === turn && sandwitched)
        return true

      if ((turn === 'W' && board[cy][cx] === 'B') || (turn === 'B' && board[cy][cx] === 'W'))
        sandwitched = true
      else
        break

      cx += dx
      cy += dy
    }
  }
  return false
}

export function filterDroppableSquare(board, turn) {
  const squares = []
  board.forEach((row, y) => {
    row.map((stone, x) => {
      if (stone === null && canDrop(turn, x, y, board))
        squares.push({x, y})
    })
  })
  return squares
}
