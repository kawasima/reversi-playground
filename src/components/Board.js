import React from 'react'
import BoardCell from './BoardCell'
import Actions from '../actions/game-actions'

const BoardRow = (props) => {
  return (
    <div style={{display: 'flex'}}>
      {props.row.map((s, x) => <BoardCell {...props} stone={s} x={x} key={`cell-${x}-${props.y}`}/>)}
    </div>
  )
}
export default class Board extends React.Component {
  render() {
    const props = this.props
    return props.board.map((row, y) => (<BoardRow {...props} row={row} y={y} key={`row-${y}`}/>))
  }

  componentDidUpdate() {
    const { turn, players, dispatch } = this.props
    if (players[turn] !== 'Human') {
      dispatch(Actions.computerTurn({
        turn
      }))
    }
  }
}
