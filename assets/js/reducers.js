import { combineReducers } from 'redux'
import app from './app/reducer'
import secrets from './app/containers/secrets/reducer'

const rootReducer = combineReducers({
  app,
  secrets
})

export default rootReducer
