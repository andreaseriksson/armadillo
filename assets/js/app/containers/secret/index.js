import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './form';
import {initializeSecrets} from '../secrets/actions';

class Secret extends React.Component {
  componentWillMount() {
    const {socket, initializeSecrets} = this.props;
    initializeSecrets(socket);
  }

  get secret() {
    const {secrets, match} = this.props;

    if (match.url == '/secrets/new') {
      return {name: null, password: null, uuid: null};
    } else {
      return secrets.find(secret => secret.uuid == match.params.uuid);
    }
  }

  render() {
    const secret = this.secret;
    return (
      <div>
        <h1 className="display-3">Secrets</h1>
        <div className="card">
          <div className="card-body">
            { secret && <Form secret={secret} /> }
          </div>
        </div>
    </div>
    );
  }
}

Secret.propTypes = {
  secrets: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
  initializeSecrets: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      initializeSecrets,
    },
    dispatch,
  );
};

const mapStateToProps = state => {
  return {
    secrets: state.secrets,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Secret);
