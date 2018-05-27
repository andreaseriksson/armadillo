import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {registerRequest} from './actions';
import {REGISTER_SUCCESS} from '../../constants';
import {readDeviceUUID} from '../../reducer';

class Register extends React.Component {
  get formData() {
    return {
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value,
    };
  }

  register(event) {
    const {history, dispatch} = this.props;
    event.preventDefault();

    registerRequest({
      user: this.formData,
      device_uuid: readDeviceUUID(),
    })
      .then(json => {
        dispatch({
          type: REGISTER_SUCCESS,
          jsonWebToken: json.data.json_web_token,
          encryptionKey: json.data.crypto_token,
          email: json.data.email,
          channelName: json.data.channel_name,
        });

        history.push('/');
      })
      .catch(error => {
        // Handle validaion errors
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <h4 className="card-header">Sign up</h4>
            <div className="card-body">
              <form onSubmit={event => this.register(event)}>
                <div className="form-group">
                  <input
                    type="text"
                    ref="email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    ref="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    ref="passwordConfirmation"
                    className="form-control"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign up
                  </button>
                </div>
              </form>
              Already have an account? Go to <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Register);
