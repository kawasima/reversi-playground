import { handleActions } from 'redux-actions'
import Actions from '../actions/strategy-actions'

const initialState = {
  strategies: {
    'priorCorners': {
      func: eval(`(function(candidates, board, turn) {
console.log(this)
const POSITION_POINT = [
  [100, -99, 4, 4, 4, 4, -99, 100],
  [-99, -99, 0, 0, 0, 0, -99, -99],
  [  4,   0, 2, 2, 2, 2,   0,   4],
  [  4,   0, 2, 2, 2, 2,   0,   4],
  [  4,   0, 2, 2, 2, 2,   0,   4],
  [  4,   0, 2, 2, 2, 2,   0,   4],
  [-99, -99, 0, 0, 0, 0, -99, -99],
  [100, -99, 4, 4, 4, 4, -99, 100],
]

        return candidates
        .map(({x, y}) => {
          const nextState = this.drop(turn, x, y, board)
          const cnt = this.filterDroppableSquare(nextState, this.nextTurn(turn)).length
          return POSITION_POINT[y][x] - cnt
        })})`)
    }
  }
}

export default handleActions({
  [Actions.setStrategy]: (state, action) => {
    return {
      ...state,
      strategies: {
        ...state.strategies,
        [action.payload.name]: {
          code: action.payload.code
        }
      }
    }
  }
}, initialState)
