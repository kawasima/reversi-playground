import React from 'react'
import styled from 'styled-components'
import Actions from '../actions/game-actions'

const Square = styled.div`
  font-size: 5vh;
  width: 10vh;
  height: 10vh;
  line-height: 50px;
  vertical-align: middle;
  border: 1px solid #000000;
  text-align: center;
  text-shadow: ${props => props.isCandidate ? 'none' : '#101010 1px 1px 5px'};
  cursor: pointer;
  color: ${props => props.color};
  background-color: ${props => props.hover ? '#996699' : '#669966'};
`

export default class BoardCell extends React.Component {
  state = {
    hover: false
  }
  render() {
    const props = this.props
    let stone = props.stone !== null ? '●' : null
    let color = props.stone === 'B' ? '#101010' : props.stone === 'W' ? '#ffffff' : 'transparent'
    const isCandidate = props.candidates.find(({x, y}) => x === props.x && y === props.y)

    if (props.gameRunning && isCandidate) {
      stone = '●'
      const opacity = this.state.hover ? 1 : 0.3
      color = props.turn === 'B' ?
        `rgba(16, 16, 16, ${opacity})`
        :
        props.turn === 'W' ? `rgba(255,255,255, ${opacity})` : 'transparent'
    }

    const createMouseHoverFn = (hover) => props.gameRunning && props.players[props.turn] === 'Human' ?
          () => this.setState({ hover })
          :
          () => {}

    return (
      <Square color={color}
              isCandidate={isCandidate}
              hover={this.state.hover}
              onMouseOut={createMouseHoverFn(false)}
              onMouseOver={createMouseHoverFn(true)}
              onClick={() => props.gameRunning && props.dispatch(Actions.dropStone({
                x: props.x,
                y: props.y,
                turn: props.turn
        })) }>
        {stone}
      </Square>
    )
  }
}
