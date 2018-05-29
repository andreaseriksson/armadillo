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

const SECURITY_CHECK_PHRASE = 'NINJA';

const encryptPin = pin => {
  return sha256(`${pin}`);
};

export const encryptAndSavePin = (encryptionKey, pin) => {
  const pinSecurityCheck = createSecurityCheck(encryptionKey, pin);

  return dispatch => {
    updateProfileRequest({
      user: {pin_security_check: pinSecurityCheck},
    }).then(() => {
      dispatch({
        type: 'SET_PIN_SECURITY_CHECK',
        pinSecurityCheck: pinSecurityCheck,
        encryptedPin: sha256(pin),
      });
    });
  };
};

export const hidePin = () => {
  return dispatch => {
    dispatch({
      type: 'HIDE_PIN',
    });
  };
};

const createSecurityCheck = (encryptionKey, pin) => {
  const encryptedPin = encryptPin(pin);
  const key = combinedEncryptionKey(encryptionKey, encryptedPin);
  const cryptr = new Cryptr(key);

  return cryptr.encrypt(SECURITY_CHECK_PHRASE);
};

export const correctPin = (encryptionKey, pin, pinSecurityCheck) => {
  return createSecurityCheck(encryptionKey, pin) == pinSecurityCheck;
};

const combinedEncryptionKey = (encryptionKey, encryptedPin) => {
  return encryptionKey + encryptedPin.substring(0, 8);
};

const updateProfileRequest = formData => {
  return fetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: readJsonWebToken(),
    },
  }).then(response => {
    return response.json();
  });
};
