import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Cryptr from 'cryptr';
import {sha256} from 'js-sha256';
import Form from './form';
import {encryptAndSavePin} from './actions';

class Lock extends React.Component {
  validatePin(pin) {
    console.log(pin)
  }

  get needToSetPin() {
    const {pinSecurityCheck} = this.props.app;
    return !pinSecurityCheck;
  }

  render() {
    // cryptr.decrypt('SMURF')
    // const encryptedString = cryptr.encrypt('bacon');
    // const decryptedString = cryptr.decrypt(encryptedString);
    // console.log(encryptedString);
    // console.log(decryptedString);
    // console.log(sha256('The quick brown fox jumps over the lazy dog'))

    // PIN + encryptionKey = combinedEncryptionKey

    const {pin} = this.props.app; // TODO: Fix

    if (pin) {
      return this.props.children;
    } else {
      return (
        <Form
          needToSetPin={this.needToSetPin}
          validatePin={this.validatePin}
          encryptAndSavePin={this.props.encryptAndSavePin}
          encryptionKey={this.encryptionKey}
        />
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {encryptAndSavePin}, dispatch,
  );
};

const mapStateToProps = state => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lock);
