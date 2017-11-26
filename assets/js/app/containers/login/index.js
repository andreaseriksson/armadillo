import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {loginRequest} from './actions'
import {LOGIN_SUCCESS} from '../../constants'

class Login extends React.Component {
  get formData() {
    return {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
  }

  login(event) {
    const {history,dispatch} = this.props
    event.preventDefault()

    loginRequest(this.formData).then(json => {
      if (json.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          jsonWebToken: json.token
        })

        history.push('/')
      } else {
        // Display login error
      }
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <h4 className="card-header">
              Sign in
            </h4>
            <div className="card-body">
              <form onSubmit={ event => this.login(event) }>
                <div className="form-group">
                  <input type="text" className="form-control" ref="email" placeholder="Email" />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" ref="password" placeholder="Password" />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                </div>
              </form>
              Don't have an account? Go to <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Login)
