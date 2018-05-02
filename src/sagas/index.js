import {
  fork,
  select,
  take,
  takeEvery,
  put,
  race
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Actions from '../actions/game-actions'
import values from 'lodash/values'
import sum from 'lodash/sum'
import { drop, canDrop, filterDroppableSquare, nextTurn } from '../utils'

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
  const evaluateFunction = yield select((s) => s.strategy.strategies[ strategy ].func)
  const scores = evaluateFunction.apply({
    drop, canDrop, filterDroppableSquare, nextTurn
  }, [candidates, board, turn])
  const max = scores.reduce((a,b,i) => a[0] < b ? [b,i] : a, [Number.NEGATIVE_INFINITY,-1])
  const {x, y} = candidates[max[1]]

  yield delay(100)

  const nextSituation = drop(turn, x, y, board)
  yield put(Actions.nextTurn({
    board: nextSituation,
    turn: nextTurn(turn),
    candidates: filterDroppableSquare(nextSituation, nextTurn(turn))
  }))
  if (sum(values(score(nextSituation))) >= 64) {
    yield put(Actions.setGameRunning(false))
  }

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
  if (sum(values(score(nextSituation)) >= 64)) {
    yield put(Actions.setGameRunning(false))
  }
}

function* handlePass(action) {
  const { board, turn } = yield select ((s) => {
    return {
      board: s.game.board,
      turn: s.game.turn
    }
  })
  yield put(Actions.nextTurn({
    board: board,
    turn: nextTurn(turn),
    candidates: filterDroppableSquare(board, nextTurn(turn))
  }))
}

function* mainGame() {
  yield takeEvery('UI_PASS', handlePass)
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
