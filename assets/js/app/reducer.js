import uuid from 'uuid/v4'
import  {
  LOCALSTORAGE_UUID,
  LOCALSTORAGE_JWT,
  LOCALSTORAGE_ENCRYPTION_KEY,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REFRESH_TOKEN_SUCCESS
} from './constants'

const FRESH_UUID = uuid()
const SET_UUID = localStorage.getItem(LOCALSTORAGE_UUID) || localStorage.setItem(LOCALSTORAGE_UUID, FRESH_UUID) || FRESH_UUID
const SET_JWT = localStorage.getItem(LOCALSTORAGE_JWT)
const SET_ENCRYPTION_KEY = localStorage.getItem(LOCALSTORAGE_ENCRYPTION_KEY)

const defaultState = {
  appUUID: SET_UUID,
  jsonWebToken: SET_JWT,
  encryptionKey: SET_ENCRYPTION_KEY,
  loggedIn: false,
  email: null
}

const app = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      saveJsonWebToken(action.jsonWebToken)
      saveEncryptionKey(action.encryptionKey)

      return Object.assign({}, state, {
        email: action.email,
        jsonWebToken: action.jsonWebToken,
        encryptionKey: action.encryptionKey,
        loggedIn: true
      })

    case LOGIN_SUCCESS:
      saveJsonWebToken(action.jsonWebToken)
      return Object.assign({}, state, {jsonWebToken: action.jsonWebToken, loggedIn: true})

    case LOGOUT_SUCCESS:
      clearJsonWebToken()
      return Object.assign({}, state, {jsonWebToken: null, loggedIn: false})

    case REFRESH_TOKEN_SUCCESS:
      saveJsonWebToken(action.jsonWebToken)
      return Object.assign({}, state, {jsonWebToken: action.jsonWebToken, loggedIn: true})

    default:
      return state
  }
};

export default app


export const readJsonWebToken = () => {
  return localStorage.getItem(LOCALSTORAGE_JWT);
}

const saveJsonWebToken = jsonWebToken => {
  localStorage.setItem(LOCALSTORAGE_JWT, jsonWebToken);
}

const clearJsonWebToken = () => {
  localStorage.removeItem(LOCALSTORAGE_JWT);
}

const saveEncryptionKey = encryptionKey => {
  localStorage.setItem(LOCALSTORAGE_ENCRYPTION_KEY, encryptionKey);
}
