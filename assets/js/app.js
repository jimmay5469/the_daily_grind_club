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
  connected: true,
  stravaId: reactAppEl.dataset.stravaId,
  isAdmin: JSON.parse(reactAppEl.dataset.isAdmin),
  athletes: athletes,
  loginUrl: reactAppEl.dataset.loginUrl,
  logoutUrl: reactAppEl.dataset.logoutUrl
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTED':
      return { ...state, connected: true, athletes: action.athletes }
    case 'DISCONNECTED':
      return { ...state, connected: false }
    case 'UPDATE_ATHLETE':
      return { ...state, athletes: state.athletes.map((athlete) => athlete.stravaId === action.athlete.stravaId ? action.athlete : athlete) }
    default:
      return state
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const athletesChannel = socket.channel(`athletes:update_athlete`, {})
athletesChannel.join()
  .receive("ok", resp => { store.dispatch({ type: 'CONNECTED', athletes: humps.camelizeKeys(resp) }) })
  .receive("error", resp => { store.dispatch({ type: 'DISCONNECTED' }) })
athletesChannel.onError(resp => { store.dispatch({ type: 'DISCONNECTED' }) })
athletesChannel.on('update_athlete', resp => { store.dispatch({ type: 'UPDATE_ATHLETE', athlete: humps.camelizeKeys(resp) }) })

render((
  <Provider store={store}>
    <TheDailyGrindClubRouter />
  </Provider>
), reactAppEl);
