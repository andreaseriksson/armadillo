import React from 'react';

class Form extends React.Component {
  handleChange() {
    const {needToSetPin} = this.props;
    if (needToSetPin) return;

    const pin = this.refs.pin.value;
    this.props.validatePin(pin);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const {needToSetPin, encryptAndSavePin, encryptionKey} = this.props;

    if (!needToSetPin) return;

    const pin = this.refs.pin.value;
    encryptAndSavePin(encryptionKey, pin);
  }

  get title() {
    const {needToSetPin} = this.props;
    if (needToSetPin) {
      return 'Enter a new PIN';
    } else {
      return 'Enter your PIN';
    }
  }

  get helpText() {
    const {needToSetPin} = this.props;
    if (needToSetPin) {
      return 'Remember the PIN number. Otherwise you cant unlock your secrets';
    } else {
      return 'The PIN number you set the first time';
    }
  }

  render() {
    const {needToSetPin} = this.props;

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
            {needToSetPin && (
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
