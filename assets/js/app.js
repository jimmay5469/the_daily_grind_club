import 'phoenix_html'

import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import humps from 'humps'
import TheDailyGrindClubRouter from './router'

import socket from './socket'

const reactAppEl = document.querySelector('[data-react-app]')

const athletes = humps.camelizeKeys(JSON.parse(reactAppEl.dataset.athletes))
const initialState = {
  hamburgerMenuOpen: false,
  connected: true,
  stravaId: reactAppEl.dataset.stravaId,
  athletes: athletes,
  loginUrl: reactAppEl.dataset.loginUrl,
  logoutUrl: reactAppEl.dataset.logoutUrl
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ROUTE_CHANGE':
      return { ...state, hamburgerMenuOpen: false }
    case 'CONNECTED':
      return { ...state, connected: true, athletes: action.athletes }
    case 'DISCONNECTED':
      return { ...state, connected: false }
    case 'UPDATE_ATHLETE':
      return { ...state, athletes: state.athletes.map((athlete) => athlete.stravaId === action.athlete.stravaId ? action.athlete : athlete) }
    case 'HAMBURGER_CLICK':
      return { ...state, hamburgerMenuOpen: !state.hamburgerMenuOpen }
    default:
      return state
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const history = createBrowserHistory()
history.listen(() => {
  window.scrollTo(0, 0)
  store.dispatch({ type: 'ROUTE_CHANGE' })
})

const athletesChannel = socket.channel(`athletes:update_athlete`, {})
athletesChannel.join()
  .receive('ok', resp => { store.dispatch({ type: 'CONNECTED', athletes: humps.camelizeKeys(resp) }) })
  .receive('error', resp => { store.dispatch({ type: 'DISCONNECTED' }) })
athletesChannel.onError(resp => { store.dispatch({ type: 'DISCONNECTED' }) })
athletesChannel.on('update_athlete', resp => { store.dispatch({ type: 'UPDATE_ATHLETE', athlete: humps.camelizeKeys(resp) }) })

render((
  <Provider store={store}>
    <TheDailyGrindClubRouter history={history} />
  </Provider>
), reactAppEl)
