import 'phoenix_html'
import 'bootstrap'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

import App from './app/index'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(
    applyMiddleware(thunk)
  )
)

if (document.getElementById('app')) {
  document.addEventListener("DOMContentLoaded", e => {
    ReactDOM.render(
      <Provider store={ store }>
        <App name="App" />
      </Provider>,
      document.getElementById('app')
    )
  })
}
