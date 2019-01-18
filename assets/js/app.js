import 'phoenix_html'

import React from 'react'
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash'
import humps from 'humps'
import moment from 'moment'
import TheDailyGrindClubRouter from './router';

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

render((
  <Provider store={store}>
    <TheDailyGrindClubRouter />
  </Provider>
), reactAppEl);
