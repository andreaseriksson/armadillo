import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {loginRequest} from './actions'
import {LOGIN_SUCCESS} from '../../constants'
import {readDeviceUUID} from '../../reducer'

class Login extends React.Component {
  get formData() {
    return {
      email: this.refs.email.value,
      password: this.refs.password.value,
      device_uuid: readDeviceUUID()
    }
  }

  login(event) {
    const {history,dispatch} = this.props
    const {awaitingApprovalModal} = this.refs
    event.preventDefault()

    loginRequest(this.formData).then(json => {
      if (json.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          jsonWebToken: json.token
        })

        history.push('/')
      } else if (json.pending_approval) {
        $(awaitingApprovalModal).modal('show')
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

        <div ref="awaitingApprovalModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Awaiting approval</h5>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                ...
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect()(Login)
