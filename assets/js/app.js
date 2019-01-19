import 'phoenix_html'

import React from 'react'
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash'
import humps from 'humps'
import moment from 'moment'
import TheDailyGrindClubRouter from './router';

import socket from './socket'

moment.relativeTimeThreshold('M', 12)
moment.relativeTimeThreshold('d', 30)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('ss', 1)

const reactAppEl = document.querySelector('[data-react-app]')

const athletes = humps.camelizeKeys(JSON.parse(reactAppEl.dataset.athletes))
const initialState = {
  stravaId: reactAppEl.dataset.stravaId,
  isAdmin: JSON.parse(reactAppEl.dataset.isAdmin),
  athletes: athletes,
  loginUrl: reactAppEl.dataset.loginUrl,
  logoutUrl: reactAppEl.dataset.logoutUrl
}

const store = createStore(
  (state = initialState) => state,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const athletesChannel = socket.channel(`athletes:update_athlete`, {})
athletesChannel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })
athletesChannel.onError(resp => { console.log("onError", resp) })
athletesChannel.on('update_athlete', resp => { console.log("update_athlete", resp) })

render((
  <Provider store={store}>
    <TheDailyGrindClubRouter />
  </Provider>
), reactAppEl);
