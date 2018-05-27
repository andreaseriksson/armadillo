/*
  X 1. Add a field in DB called pin_security_check
     mix phx.gen.migration AddPinSecutityCheckToUsers
  2. If it is empty - Need to set PIN
  3. Enter new PIN - ENCRYPT IT - Save it in Redux - encryptedPin
  4. Use combined key to encrypt the word NINJA and save it in pin_security_check
  5. ----- Pin empty -----
  6. Enter PIN, makse security check, save it in Reduc in encryptedPin
    - secutityCheck = if encrypt with combined key should equal pin_security_check
  7. Clear out encryptedPin after 30 seconds of inactivity
*/

import Cryptr from 'cryptr';
import {sha256} from 'js-sha256';
import {readJsonWebToken} from '../../reducer';

// const LOCALSTORAGE_PIN_KEY = 'LOCALSTORAGE_PIN_KEY';
// const LOCALSTORAGE_ENCRYPTED_PIN = 'LOCALSTORAGE_ENCRYPTED_PIN';
const SECURITY_CHECK_PHRASE = 'NINJA';


// const shouldSetNewPin = () => {
//   return !readPin() === true;
// }

export const encryptAndSavePin = (encryptionKey, pin) => {
  const pinSecurityCheck = createSecurityCheck(encryptionKey, pin);

  return dispatch => {
    updateProfileRequest({user: { pin_security_check: pinSecurityCheck }}).then(() => {
      dispatch({
        type: 'SET_PIN_SECURITY_CHECK',
        pinSecurityCheck: pinSecurityCheck,
        encryptedPin: sha256(pin)
      })
    })
  }
}

const updateProfileRequest = formData => {
  return fetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: readJsonWebToken(),
    },
  }).then(response => {
    return response.json()
  })
}

const createSecurityCheck = (encryptionKey, pin) => {
  const encryptedPin = sha256(pin);
  const key = combinedEncryptionKey(encryptionKey, encryptedPin)
  const cryptr = new Cryptr(key);

  return cryptr.encrypt(SECURITY_CHECK_PHRASE);
}

const correctPin = (encryptionKey) => {
  const key = combinedEncryptionKey(encryptionKey)
  const cryptr = new Cryptr(key);

  try {
    return cryptr.decrypt(encryptedString) === 'SMURF';
  } catch(_) {
    return false;
  }
}

const combinedEncryptionKey = (encryptionKey, encryptedPin) => {
  return encryptionKey + encryptedPin.substring(0, 8);
}

//
// export const readPin = () => {
//   return localStorage.getItem(LOCALSTORAGE_ENCRYPTED_PIN);
// };
//
// const savePin = pin => {
//   localStorage.setItem(LOCALSTORAGE_ENCRYPTED_PIN, pin);
// };
//
// const clearPin = () => {
//   localStorage.removeItem(LOCALSTORAGE_ENCRYPTED_PIN);
// };
