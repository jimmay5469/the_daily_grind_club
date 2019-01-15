import React from 'react'
import { render } from 'react-dom';
import _ from 'lodash'
import humps from 'humps'
import moment from 'moment'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './components/Layout'
import AthleteListRoute from './components/AthleteListRoute'
import AthleteRoute from './components/AthleteRoute'

moment.relativeTimeThreshold('M', 12)
moment.relativeTimeThreshold('d', 30)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('ss', 1)

// Import dependencies
//
import 'phoenix_html'

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from './socket'

const reactAppEl = document.querySelector('[data-react-app]')
const athletes = humps.camelizeKeys(JSON.parse(reactAppEl.dataset.athletes))

render((
  <Router>
    <Layout
      athleteId={reactAppEl.dataset.athleteId}
      athletes={athletes}
      loginUrl={reactAppEl.dataset.loginUrl}
      logoutUrl={reactAppEl.dataset.logoutUrl}
    >
      <Route exact path='/' render={()=>(
        <AthleteListRoute
          athletes={athletes}
          isAdmin={JSON.parse(reactAppEl.dataset.isAdmin)}
        />
      )} />
      <Route exact path='/athlete/:id' render={({match: {params: {id}}})=>(
        <AthleteRoute
          athlete={_.find(athletes, { 'id': Number(id) })}
        />
      )} />
    </Layout>
  </Router>
), reactAppEl);
