import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AthleteListRoute from './components/AthleteListRoute'
import AthleteRoute from './components/AthleteRoute'

export default ({ history }) => (
  <Router history={history}>
    <Layout>
      <Switch>
        <Route exact path='/' component={AthleteListRoute} />
        <Route path='/athletes/:id' component={AthleteRoute} />
        <Route render={() => (<div>Page not found!</div>)} />
      </Switch>
    </Layout>
  </Router>
)
