import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Board from '../components/Board'
import Actions from '../actions/game-actions'

function calcScore(board) {
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

const WhiteStone = styled.div`
  color: #ffffff;
  font-size: 30px;
  text-shadow: #101010 1px 1px 5px;
`

const BlackStone = styled.div`
  color: #101010;
  font-size: 30px;
  text-shadow: #101010 1px 1px 5px;
`

const BoardContainer = (props) => {
  const turnMessage = `It's ${props.turn === 'W' ? 'White' : props.turn === 'B' ? 'Black' : null} trun`
  const score = calcScore(props.board)
  const gameStartButton = props.gameRunning ?
        null
        :
        (
          <button className="ui button"
                  onClick={() => props.dispatch(Actions.setGameRunning(true))}>
            Start
          </button>
        )
  return (
    <div className="ui two column grid">
      <div className="column">
        <Board {...props}/>
      </div>
      <div className="column">
        <div className="ui grid">
          <div className="row">
            <div className="column">{turnMessage}</div>
          </div>
          <div className="row">
            <div className="ui huge horizontal statistic column">
              <div className="label"><WhiteStone>●</WhiteStone></div>
              <div className="value">{score['W']}</div>
            </div>
          </div>
          <div className="row">
            <div className="ui huge horizontal statistic column">
              <div className="label"><BlackStone>●</BlackStone></div>
              <div className="value">{score['B']}</div>
            </div>
          </div>
          <div className="row">
            {gameStartButton}
          </div>
        </div>
      </div>
    </div>
  )
}

const connector = connect(
  ({ game }) => game,
  dispatch => {
    return {
      dispatch
    }
  }
)

export default connector(BoardContainer)
