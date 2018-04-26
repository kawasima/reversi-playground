import {
  fork,
  select,
  take,
  put,
  race
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Actions from '../actions/game-actions'

export function nextTurn(turn) {
  switch(turn) {
  case 'W': return 'B'
  case 'B': return 'W'
  default: throw new Error(`Unknown turn: ${turn}`)
  }
}

export function score(board) {
  const score = { 'W': 0, 'B': 0 }
  board.forEach(row => row.forEach(s => {
    if (s === 'W') {
      score['W'] += 1
    } else if (s === 'B') {
      score['B'] += 1
    }
  }))
  return score
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

const STRATEGIES = {
  'priorCorners': (candidates, board, turn) => candidates
        .map(({x, y}) => {
          const nextState = drop(turn, x, y, board)
          const cnt = filterDroppableSquare(nextState, nextTurn(turn)).length
          return -cnt
            + ((x == 0 || x == 7) ? 4 : 0)
            + ((y == 0 || y == 7) ? 4 : 0)
            + (((x == 0 || x == 7) && (y == 0 || y == 7)) ? 10 : 0)
        })
}

function* handleComputerTurn(strategy, turn) {
  const board = yield select ((s) => s.game.board)
  const candidates = filterDroppableSquare(board, turn)
  if (candidates.length === 0) {
    yield put(Actions.nextTurn({
      board: board,
      turn: nextTurn(turn),
      candidates: filterDroppableSquare(board, nextTurn(turn))
    }))
    return
  }
  const evaluateFunction = STRATEGIES[strategy]
  const scores = evaluateFunction(candidates, board, turn)
  const max = scores.reduce((a,b,i) => a[0] < b ? [b,i] : a, [Number.NEGATIVE_INFINITY,-1])
  const {x, y} = candidates[max[1]]

  yield delay(100)

  const nextSituation = drop(turn, x, y, board)
  yield put(Actions.nextTurn({
    board: nextSituation,
    turn: nextTurn(turn),
    candidates: filterDroppableSquare(nextSituation, nextTurn(turn))
  }))
}

function* handleDropStone({ x, y, turn }) {
  const board = yield select ((s) => s.game.board)
  if (!canDrop(turn, x, y, board)) return
  const nextSituation = drop(turn, x, y, board)
  yield put(Actions.nextTurn({
    board: nextSituation,
    turn: nextTurn(turn),
    candidates: filterDroppableSquare(nextSituation, nextTurn(turn))
  }))
}

function* mainGame() {
  while(true) {
    const action = yield race({
      human: take('DROP_STONE'),
      computer: take('COMPUTER_TURN')
    })
    if (action.human) {
      yield* handleDropStone(action.human.payload)
    } else if (action.computer) {
      const turn = action.computer.payload.turn
      const strategy = yield select((s) => s.game.players[turn])
      yield* handleComputerTurn(strategy, turn)
    }
  }
}

export default function* rootSaga() {
  yield fork(mainGame)
}
