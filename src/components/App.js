import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Layout from './Layout'
import BoardContainer from '../containers/BoardContainer'

const App = () => {
  const routing = (
    <Switch>
      <Route exact path='/' component={BoardContainer}/>
    </Switch>
  )

  return (
    <Router>
      <Layout children={routing} />
    </Router>
  )
}

export default App
