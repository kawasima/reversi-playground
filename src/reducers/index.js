import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import game from './game-reducer'

export default combineReducers({
  game,
  routing: routerReducer
})
