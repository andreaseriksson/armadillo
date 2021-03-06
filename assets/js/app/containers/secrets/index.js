import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {initializeSecrets} from './actions';

class Secrets extends React.Component {
  componentWillMount() {
    const {socket, initializeSecrets} = this.props;
    initializeSecrets(socket);
  }

  render() {
    const {secrets} = this.props;

    return (
      <div>
        <h1 className="display-3">Secrets</h1>

        <div className="mt-4">
          {secrets.map((secret, idx) => {
            return (
              <div className="card mt-2" key={idx}>
                <Link className="card-header" to={`/secrets/${secret.uuid}`}>
                  {secret.name}
                </Link>
              </div>
            );
          })}
        </div>

        <Link to="/secrets/new" id="smurf" className="btn btn-primary bmd-btn-fab">
          <i className="material-icons">create_new_folder</i>
        </Link>
      </div>
    );
  }
}

Secrets.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Secrets);
