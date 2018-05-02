import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import game from './game-reducer'
import strategy from './strategy-reducer'

export default combineReducers({
  strategy,
  game,
  routing: routerReducer
})
