import React from 'react'
import PropTypes from 'prop-types'

export default function Layout(props) {
  return (
    <div className="ui main container">
      {props.children}
    </div>
  )
}
