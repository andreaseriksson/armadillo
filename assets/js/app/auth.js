import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Socket} from 'phoenix'
import {Redirect} from 'react-router-dom'
import {REFRESH_TOKEN_SUCCESS, LOGOUT_SUCCESS} from './constants'

class Auth extends React.Component {
  get online() {
    return navigator.onLine
  }

  get loggedIn() {
    const { app } = this.props

    if (this.online) {
      return app.jsonWebToken
    } else {
      return app.jsonWebToken
    }
  }

  componentWillMount() {
    const { app, dispatch } = this.props

    if (app.jsonWebToken && !app.loggedIn) {
      this.refreshToken()
    }
  }

  render() {
    // https://reacttraining.com/react-router/web/example/auth-workflow
    return this.loggedIn ? this.props.children : <Redirect to={{ pathname: '/login' }} />
  }

  // Refresh the jst from the server through a websocket connection
  refreshToken() {
    const {socket, app, dispatch, history} = this.props

    let channel = socket.channel("auth:refresh", {})

    channel.join()
      .receive('ok', response => { console.log('Joined successfully', response) })
      .receive('error', response => {
        console.log('dUnable to join', response)
        logoutAndRedirect()
      })

    channel.push('token:refresh', { token: app.jsonWebToken })

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
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(Auth)
