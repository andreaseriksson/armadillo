import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import Secret from './secret'
import Icon from '../../components/icon'
import {
  loadSecrets,
  initializeSecrets
} from './actions'
import {RECEIVE_SECRETS} from './constants'

class Secrets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: null
    }
  }

  componentWillMount() {
    const {socket, initializeSecrets} = this.props
    initializeSecrets(socket)
  }

  loadAndSyncSecrets(channel) {
    const {dispatch, app} = this.props

    channel.push("secrets:index", {
      secrets: [],
      events: []
    })
  }

  newSecret() {
    this.setState({secret: {}})
    setTimeout(() => {
      $(this.refs.newSecret).collapse('show')
    }, 100)
  }

  toggleCollapse(collapse, secret, event) {
    if (event) {
      event.preventDefault()
    }
    if (secret) {

      this.setState({secret})
      setTimeout(() => {
        $(collapse).collapse('toggle')
      }, 100)

    } else {

      $(collapse).collapse('toggle')
      setTimeout(() => {
        this.setState({secret: null})
      }, 800)
    }
  }

  render() {
    const {secrets} = this.props

    return (
      <div className="mt-4">
        <div className="row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Search.." />
          </div>
          <div className="col-3 text-right">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => this.newSecret()}
              disabled={this.state.secret != null}
            >
              <span className="hide-phone">New secret </span>
              <Icon name="plus" />
            </button>
          </div>
        </div>
        <div ref="newSecret" className="mt-4 collapse">
          {
            this.state.secret && !this.state.secret.uuid &&
              <div className="card">
                <div className="card-header">
                  Add secret
                  <button
                    type="button"
                    className="close"
                    onClick={() => this.toggleCollapse(this.refs.newSecret)}
                  >&times;</button>
                </div>
                <div className="card-body">
                  <Secret
                    secret={{}}
                    close={() => this.toggleCollapse(this.refs.newSecret)}
                  />
                </div>
              </div>
          }
        </div>

        <div id="secrets-list" className="mt-4" role="tablist">
          {
            secrets.map((secret, idx) => {
              return (
                <div className="card mt-2" key={idx}>
                  <a
                    onClick={ event => this.toggleCollapse(`#collapse${idx}`, secret, event)}
                    className="card-header"
                    data-toggle="zcollapse"
                    href={`#collapse${idx}`}
                  >
                    {secret.name}
                  </a>
                  <div id={`collapse${idx}`} className="collapse" data-parent="#secrets-list">
                    <div className="card-body">
                      {
                        this.state.secret && this.state.secret.uuid == secret.uuid &&
                          <Secret
                            secret={this.state.secret}
                            close={() => this.toggleCollapse(`#collapse${idx}`)}
                          />
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Secrets.propTypes = {
  secrets: PropTypes.array.isRequired,
  app: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    initializeSecrets
  }, dispatch)
}

const mapStateToProps = state => {
  return {
    app: state.app,
    secrets: state.secrets
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Secrets)
