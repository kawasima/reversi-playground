import {
  filterDroppableSquare,
  drop,
  score,
  evaluate,
  nextTurn
} from 'sagas/index'
import random from 'lodash/random'


function createBoard(...args) {
  return args.map(arg => {
    return arg.split('').map(stone => {
      return stone === 'o' ? 'W' : stone === 'x' ? 'B' : null
    })
  })
}

function printBoard(board) {
  return board.map(row => {
    return row.map(stone => {
      return stone === 'W' ? 'o' : stone === 'B' ? 'x' : '-'
    }).join('')
  }).join('\n')
}

function minEnemysCandidates(candidates, board, turn) {
  return candidates
        .map(({x, y}) => {
          const nextState = drop(turn, x, y, board)
          const cnt = filterDroppableSquare(nextState, nextTurn(turn)).length
          return 64 - cnt
        })
}

function priorCorners(candidates, board, turn) {
  return candidates
        .map(({x, y}) => {
          const nextState = drop(turn, x, y, board)
          const cnt = filterDroppableSquare(nextState, nextTurn(turn)).length
          return -cnt
            + ((x == 0 || x == 7) ? 4 : 0)
            + ((y == 0 || y == 7) ? 4 : 0)
            + (((x == 0 || x == 7) && (y == 0 || y == 7)) ? 10 : 0)
        })
}

function randomCandidates(candidates, board, turn) {
  return candidates.map(c => random(10))
}

describe('test1', () => {
  test('test', () => {
    let board = createBoard(
      '--------',
      '--------',
      '--------',
      '---ox---',
      '---xo---',
      '--------',
      '--------',
      '--------',
    )
    let turn = 'W'
    const evaluateFunctions = {
      'W': randomCandidates,
      'B': priorCorners
    }

    while(true) {
      const candidates = filterDroppableSquare(board, turn)
      if (candidates.length === 0) {
        turn = nextTurn(turn)
        continue
      }
      const scores = evaluateFunctions[turn](candidates, board, turn)
      const max = scores.reduce((a,b,i) => a[0] < b ? [b,i] : a, [Number.NEGATIVE_INFINITY,-1])
      console.log(candidates.map((c, i) => `${c.x}, ${c.y} = ${scores[i]}`))
      const {x, y} = candidates[max[1]]

      board = drop(turn, x, y, board)
      console.log(printBoard(board))
      const s = score(board)
      if (s['W'] + s['B'] >= 64) break
      console.log(`White=${s['W']},Black=${s['B']}`)
      turn = nextTurn(turn)
    }
  })
})
