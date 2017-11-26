import {
  RECEIVE_SECRETS,
  SAVE_SECRET,
  UPDATE_SECRET,
  DELETE_SECRET
} from './constants'

import {
  dbSecrets,
  allSecrets,
  getSecret,
  allEvents,
  addEvent
} from './database'

import {readJsonWebToken} from '../../reducer'

import uuid from 'uuid/v4'

var channel

export const connectToChannel = (socket, dispatch) => {
  channel = socket.channel('secrets', { guardian_token: readJsonWebToken() })

  channel.join()
    .receive('ok', () => { loadAndSyncSecrets(channel) })
    .receive('error', response => { console.log('Unable to join', response) })

  channel.on('sync:end', data => {
    console.log(data)
      // dispatch({
      //   type: REFRESH_TOKEN_SUCCESS,
      //   jsonWebToken: event.token
      // })
    })
}

export const initializeSecrets = socket => {
  return dispatch => {
    loadSecrets().then(secrets => {
      dispatch({
        type: RECEIVE_SECRETS,
        secrets: secrets
      })

      connectToChannel(socket, dispatch)
    })
  }
}

export const loadSecrets = () => {
  return new Promise((resolve, _reject) => {
    allSecrets.then(secrets => resolve(secrets)).catch(() => reject([]))
  })
}

export const loadEvents = () => {
  return new Promise((resolve, _reject) => {
    allEvents.then(events => resolve(events)).catch(() => reject([]))
  })
}

const loadAndSyncSecrets = channel => {
  Promise.all([
    loadSecrets(),
    loadEvents(),
  ]).then(values => {
    // Delete id field
    const secrets = values[0].map(secret => {
      delete secret.id
      return secret
    })

    // Take distinct events (sorted by id desc)
    const events = values[1].reduce((acc, event) => {
      const current = acc.map(e => e.uuid)
      return acc.map(e => e.uuid).includes(event.uuid) ? acc : acc.concat(event)
    }, [])

    channel.push('sync:start', {secrets, events})
  })
}

export const saveSecret = secret => {
  return dispatch => {
    if (secret.uuid) {
      getSecret(secret.uuid).modify(secret).then(() => {
        addEvent({type: SAVE_SECRET, uuid: secret.uuid}).then(() => {})

        dispatch({
          type: UPDATE_SECRET,
          secret: secret
        })

        updateSecretInApi(secret).catch(error => console.log(error))
      }).catch(error => console.log(error))
    } else {
      secret['uuid'] = uuid()

      dbSecrets.add(secret).then(() => {
        addEvent({type: SAVE_SECRET, uuid: secret.uuid}).then(() => {})

        dispatch({
          type: SAVE_SECRET,
          secret: secret
        })

        createSecretInApi(secret).catch(error => console.log(error))
      })
    }
  }
}

export const deleteSecret = secret => {
  return dispatch => {
    getSecret(secret.uuid).delete().then(() => {
      addEvent({type: DELETE_SECRET, uuid: secret.uuid}).then(() => {})

      dispatch({
        type: DELETE_SECRET,
        secret: secret
      })

      deleteSecretInApi(secret).catch(error => console.log(error))
    })
  }
}

const createSecretInApi = secret => {
  return fetch('/api/secrets/', {
    method: 'POST',
    body: JSON.stringify({ secret }),
    headers: { 'Content-Type': 'application/json', 'Authorization': readJsonWebToken() }
  }).then(response => {
    return response.json()
  })
}

export const updateSecretInApi = secret => {
  return fetch(`/api/secrets/${secret.uuid}`, {
    method: 'PUT',
    body: JSON.stringify({ secret }),
    headers: { 'Content-Type': 'application/json', 'Authorization': readJsonWebToken() }
  }).then(response => {
    return response.json()
  })
}

export const deleteSecretInApi = secret => {
  return fetch(`/api/secrets/${secret.uuid}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': readJsonWebToken() }
  }).then(response => {
    return response.json()
  })
}
