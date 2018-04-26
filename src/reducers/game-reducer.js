import { handleActions } from 'redux-actions'
import actions from '../actions/game-actions'

const initialState = {
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null,  'W',  'B', null, null, null],
    [null, null, null,  'B',  'W', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ],
  turn: 'W',
  candidates: [{x:4, y:2}, {x:5, y:3}, {x:2, y:4}, {x:3, y:5}],
  players: {
    'W': 'Human',
    'B': 'priorCorners'
  },
  gameRunning: false
}

export default handleActions({
  [actions.nextTurn]: (state, action) => {
    return {
      ...state,
      board: action.payload.board,
      turn: action.payload.turn,
      candidates: action.payload.candidates
    }
  },
  [actions.setGameRunning]: (state, action) => {
    return {
      ...state,
      gameRunning: action.payload
    }
  }
}, initialState)
