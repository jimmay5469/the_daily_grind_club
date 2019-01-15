import React from 'react'
import { render } from 'react-dom';
import humps from 'humps'
import _ from 'lodash'
import Layout from './components/Layout'
import Athletes from './components/Athletes'
import Athlete from './components/Athlete'
import { BrowserRouter as Router, Route } from "react-router-dom";

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
        <Athletes
          athletes={athletes}
          isAdmin={JSON.parse(reactAppEl.dataset.isAdmin)}
        />
      )} />
      <Route exact path='/athlete/:id' render={({match: {params: {id}}})=>(
        <Athlete
          athlete={_.find(athletes, { 'id': Number(id) })}
        />
      )} />
    </Layout>
  </Router>
), reactAppEl);
