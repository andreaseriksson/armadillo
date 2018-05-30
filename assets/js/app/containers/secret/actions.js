import Cryptr from 'cryptr';
import {sha256} from 'js-sha256';

const encryptValue = (encryptionKey, encryptedPin, stringToEncrypt) => {
  const key = combinedEncryptionKey(encryptionKey, encryptedPin);
  const cryptr = new Cryptr(key);

  return cryptr.encrypt(stringToEncrypt);
};

const decryptValue = (encryptionKey, encryptedPin, stringToDecrypt) => {
  const key = combinedEncryptionKey(encryptionKey, encryptedPin);
  const cryptr = new Cryptr(key);

  try {
    return cryptr.decrypt(stringToDecrypt);
  } catch (_error) {
    return undefined;
  }
};

export const combinedEncryptionKey = (encryptionKey, encryptedPin) => {
  return encryptionKey + encryptedPin.substring(0, 8);
};
