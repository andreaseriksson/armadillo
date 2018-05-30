import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Form from './form';
import {encryptAndSavePin, correctPin, hidePin} from './actions';

class Lock extends React.Component {
  validatePin(pin, hidePin) {
    const {pinSecurityCheck, encryptionKey} = this.props.app;

    if (correctPin(encryptionKey, pin, pinSecurityCheck)) {
      hidePin(pin);
    }
  }

  get needToSetNewPin() {
    const {pinSecurityCheck} = this.props.app;
    return !pinSecurityCheck;
  }

  get needToEnterPin() {
    const {encryptedPin} = this.props.app;
    return !encryptedPin;
  }

  render() {
    const {encryptionKey} = this.props.app;

    if (!this.needToEnterPin) {
      return this.props.children;
    } else {
      return (
        <Form
          needToSetPin={this.needToSetNewPin}
          validatePin={this.validatePin.bind(this)}
          encryptAndSavePin={this.props.encryptAndSavePin}
          hidePin={this.props.hidePin}
          encryptionKey={encryptionKey}
        />
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {encryptAndSavePin, hidePin}, dispatch,
  );
};

const mapStateToProps = state => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lock);
