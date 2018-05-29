import React from 'react';

class Form extends React.Component {
  handleChange() {
    const {needToSetNewPin, hidePin} = this.props;
    if (needToSetNewPin) return;

    const pin = this.refs.pin.value;
    this.props.validatePin(pin, hidePin);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const {needToSetNewPin, encryptAndSavePin, encryptionKey} = this.props;

    if (!needToSetNewPin) return;

    const pin = this.refs.pin.value;
    encryptAndSavePin(encryptionKey, pin);
    this.refs.pin.value = '';
  }

  get title() {
    const {needToSetNewPin} = this.props;
    if (needToSetNewPin) {
      return 'Enter a new PIN';
    } else {
      return 'Enter your PIN';
    }
  }

  get helpText() {
    const {needToSetNewPin} = this.props;
    if (needToSetNewPin) {
      return 'Remember the PIN number. Otherwise you cant unlock your secrets';
    } else {
      return 'The PIN number you set the first time';
    }
  }

  render() {
    const {needToSetNewPin} = this.props;

    return (
      <div className="card">
        <div className="card-header">{this.title}</div>
        <div className="card-body">
          <form onSubmit={event => this.handleFormSubmit(event)}>
            <div className="form-group">
              <label htmlFor="pinInput" className="bmd-label-floating">
                PIN
              </label>
              <input
                id="pinInput"
                ref="pin"
                type="number"
                placeholder={this.title}
                defaultValue={''}
                className="form-control"
                min="1000"
                max="999999"
                required="true"
                onChange={() => this.handleChange()}
              />
              <small className="form-text text-muted">{this.helpText}</small>
            </div>
            {needToSetNewPin && (
              <button type="submit" className="btn btn-block btn-primary">
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default Form;
