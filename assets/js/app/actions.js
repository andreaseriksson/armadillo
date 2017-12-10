import {
  REFRESH_TOKEN_SUCCESS,
  LOGOUT_SUCCESS
} from './constants'

import {
  readJsonWebToken,
  readChannelName
} from './reducer'

var channel

export const connectToAuthChannel = (socket, history) => {
  return dispatch => {
    channel = socket.channel(`auth:${readChannelName()}`, { guardian_token: readJsonWebToken() })

    channel.join()
      .receive('ok', response => { console.log('Joined successfully', response) })
      .receive('error', response => { console.log('Unable to join', response) })

    channel.push('token:refresh', { token: readJsonWebToken() })

    channel.on('token:new', event => {
      dispatch({
        type: REFRESH_TOKEN_SUCCESS,
        jsonWebToken: event.token
      })
    })

    channel.on('token:unauthorized', event => {
      dispatch({type: LOGOUT_SUCCESS})
      history.push('/login')
    })

    return channel
  }
}
