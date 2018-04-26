import React from 'react'
import styled from 'styled-components'
import Actions from '../actions/game-actions'

const Square = styled.div`
  font-size: 30px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  border: 1px solid #000000;
  text-align: center;
  text-shadow: #101010 1px 1px 5px;
  cursor: pointer;
  color: ${props => props.color}
  background-color: ${props => props.hover ? '#996699' : '#669966'}
`

export default class BoardCell extends React.Component {
  state = {
    hover: false
  }
  render() {
    const props = this.props
    let stone = props.stone !== null ? '●' : null
    let color = props.stone === 'B' ? '#101010' : props.stone === 'W' ? '#ffffff' : 'transparent'

    if (this.state.hover && props.candidates.find(({x, y}) => x === props.x && y === props.y)) {
      stone = '●'
      color = props.turn === 'B' ? '#101010' : props.turn === 'W' ? '#ffffff' : 'transparent'
    }

    const createMouseHoverFn = (hover) => props.players[props.turn] === 'Human' ?
          () => this.setState({ hover })
          :
          () => {}

    return (
      <Square color={color}
              hover={this.state.hover}
              onMouseOut={createMouseHoverFn(false)}
              onMouseOver={createMouseHoverFn(true)}
              onClick={() => props.dispatch(Actions.dropStone({
                x: props.x,
                y: props.y,
                turn: props.turn
        })) }>
        {stone}
      </Square>
    )
  }
}
