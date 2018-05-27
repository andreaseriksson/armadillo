import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {saveSecret, deleteSecret} from '../secrets/actions';
import Icon from '../../components/icon';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayUsername: false,
      displayPassword: false,
    };
  }

  componentDidMount() {
    const {secret} = this.props;
    if (!secret.username || !secret.password) {
      this.setState({
        displayUsername: !secret.username,
        displayPassword: !secret.password,
      });
    }
  }

  handleSubmit(event) {
    const {dispatch, secret, close} = this.props;
    event.preventDefault();

    // dispatch(saveSecret(Object.assign({}, secret, this.formData)));

    // close();
  }

  toggle(field) {
    const currentState = this.state[field];
    let newState = {};

    newState[field] = !currentState;
    this.setState(newState);
  }

  delete() {
    const {dispatch, secret, close} = this.props;

    // dispatch(deleteSecret(secret));
    //
    // close();
  }

  get formData() {
    const {name, url, username, password, description} = this.refs;

    return {
      name: name.value,
      url: url.value,
      username: username.value,
      password: password.value,
      description: description.value,
    };
  }

  render() {
    const {
      name,
      url,
      username,
      password,
      description,
      uuid,
    } = this.props.secret;
    const {displayUsername, displayPassword} = this.state;
    const openProps = {type: 'text', className: 'form-control'};
    const lockedProps = {
      type: 'password',
      className: 'form-control-plaintext',
      readOnly: true,
      placeholder: '',
    };
    const usernameProps = displayUsername ? openProps : lockedProps;
    const passwordProps = displayPassword ? openProps : lockedProps;

    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <GenericFormGroup label="Name">
          <input
            type="text"
            ref="name"
            className="form-control"
            defaultValue={name}
            placeholder="Name.."
          />
        </GenericFormGroup>

        <GenericFormGroup label="URL">
          <input
            type="text"
            ref="url"
            className="form-control"
            defaultValue={url}
            placeholder="URL to login.."
          />
        </GenericFormGroup>

        <AdvancedFormGroup
          label="Username"
          toggle={() => this.toggle('displayUsername')}>
          <input
            ref="username"
            placeholder="Username.."
            defaultValue={username}
            {...usernameProps}
          />
        </AdvancedFormGroup>

        <AdvancedFormGroup
          label="Password"
          toggle={() => this.toggle('displayPassword')}>
          <input
            ref="password"
            placeholder="Password.."
            defaultValue={password}
            {...passwordProps}
          />
        </AdvancedFormGroup>

        <GenericFormGroup label="Description">
          <textarea
            className="form-control"
            ref="description"
            defaultValue={description}
            placeholder="Description.."
          />
        </GenericFormGroup>

        <div className="text-right">
          {uuid && (
            <button
              type="button"
              className="btn btn-danger pull-left"
              onClick={() => this.delete()}>
              <Icon name="trash" />
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  secret: PropTypes.object.isRequired,
  // close: PropTypes.func.isRequired,
  // dispatch: PropTypes.func.isRequired,
};

export default Form;

const GenericFormGroup = props => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label">{props.label}</label>
    <div className="col-sm-9">{props.children}</div>
  </div>
);

const AdvancedFormGroup = props => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label">{props.label}</label>
    <div className="col col-sm-7">{props.children}</div>
    <div className="col-3 col-sm-2">
      <a
        href="#"
        role="button"
        className="btn btn-outline-primary btn-block"
        onClick={event => {
          event.preventDefault();
          props.toggle();
        }}>
        <i className="fa fa-eye" />
      </a>
    </div>
  </div>
);
