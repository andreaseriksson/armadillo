import uuid from 'uuid/v4';
import {
  LOCALSTORAGE_UUID,
  LOCALSTORAGE_JWT,
  LOCALSTORAGE_ENCRYPTION_KEY,
  LOCALSTORAGE_CHANNEL_NAME,
  LOCALSTORAGE_PIN_SECURITY_CHECK,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
} from './constants';

const FRESH_UUID = uuid();
const SET_UUID =
  localStorage.getItem(LOCALSTORAGE_UUID) ||
  localStorage.setItem(LOCALSTORAGE_UUID, FRESH_UUID) ||
  FRESH_UUID;
const SET_JWT = localStorage.getItem(LOCALSTORAGE_JWT);
const SET_ENCRYPTION_KEY = localStorage.getItem(LOCALSTORAGE_ENCRYPTION_KEY);
const SET_CHANNEL_NAME = localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME);
const SET_PIN_SECURITY_CHECK = localStorage.getItem(LOCALSTORAGE_PIN_SECURITY_CHECK);

const defaultState = {
  deviceUUID: SET_UUID,
  jsonWebToken: SET_JWT,
  encryptionKey: SET_ENCRYPTION_KEY,
  channelName: SET_CHANNEL_NAME,
  loggedIn: false,
  email: null,
  encryptedPin: null,
  pinSecurityCheck: SET_PIN_SECURITY_CHECK,
};

const app = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      saveJsonWebToken(action.jsonWebToken);
      saveEncryptionKey(action.encryptionKey);
      saveChannelName(action.channelName);

      return Object.assign({}, state, {
        email: action.email,
        jsonWebToken: action.jsonWebToken,
        encryptionKey: action.encryptionKey,
        channelName: action.channelName,
        loggedIn: true,
      });

    case LOGIN_SUCCESS:
      saveJsonWebToken(action.jsonWebToken);
      savePinSecurityCheck(action.pinSecurityCheck);
      // TODO: Added channel_name and crypto_token instead of 2FA
      saveEncryptionKey(action.encryptionKey);
      saveChannelName(action.channelName);
      return Object.assign({}, state, {
        jsonWebToken: action.jsonWebToken,
        loggedIn: true,
      });

    case LOGOUT_SUCCESS:
      clearJsonWebToken();
      return Object.assign({}, state, {jsonWebToken: null, loggedIn: false});

    case REFRESH_TOKEN_SUCCESS:
      saveJsonWebToken(action.jsonWebToken);
      return Object.assign({}, state, {
        jsonWebToken: action.jsonWebToken,
        loggedIn: true,
      });

    case 'SET_PIN_SECURITY_CHECK':
      savePinSecurityCheck(action.pinSecurityCheck);
      return Object.assign({}, state, {
        pinSecurityCheck: action.pinSecurityCheck,
        encryptedPin: action.encryptedPin,
      });

    default:
      return state;
  }
};

export default app;

export const readDeviceUUID = () => {
  return localStorage.getItem(LOCALSTORAGE_UUID);
};

export const readJsonWebToken = () => {
  return localStorage.getItem(LOCALSTORAGE_JWT);
};

export const readChannelName = () => {
  return localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME);
};

// export const readPinSecurityCheck = () => {
//   return localStorage.getItem(LOCALSTORAGE_PIN_SECURITY_CHECK);
// };

const saveJsonWebToken = jsonWebToken => {
  localStorage.setItem(LOCALSTORAGE_JWT, jsonWebToken);
};

const clearJsonWebToken = () => {
  localStorage.removeItem(LOCALSTORAGE_JWT);
};

const saveEncryptionKey = encryptionKey => {
  localStorage.setItem(LOCALSTORAGE_ENCRYPTION_KEY, encryptionKey);
};

const saveChannelName = channelName => {
  localStorage.setItem(LOCALSTORAGE_CHANNEL_NAME, channelName);
};

const savePinSecurityCheck = pinSecurityCheck => {
  localStorage.setItem(LOCALSTORAGE_PIN_SECURITY_CHECK, pinSecurityCheck);
};
