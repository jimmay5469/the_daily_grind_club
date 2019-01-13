import React from 'react'
import { render } from 'react-dom';
import Layout from './components/Layout'
import Athletes from './components/Athletes'

// Import dependencies
//
import 'phoenix_html'

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from './socket'

const reactAppEl = document.querySelector('[data-react-app]')
const athletes = JSON.parse(reactAppEl.dataset.athletes)

render((
  <Layout
    athleteId={reactAppEl.dataset.athleteId}
    athletes={athletes}
    loginUrl={reactAppEl.dataset.loginUrl}
    logoutUrl={reactAppEl.dataset.logoutUrl}
  >
    <Athletes athletes={athletes} />
  </Layout>
), reactAppEl);
