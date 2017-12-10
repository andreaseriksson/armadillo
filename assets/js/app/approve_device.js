import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Icon from './components/icon'

const POSSIBLE_ACTIONS = ['approveo', 'deny']

class ApproveDevice extends React.Component {
  componentDidMount() {
    $(this.refs.deviceApprovalModal).modal('show')
  }

  handleClick(event, action) {
    const {channel, device} = this.props
    event.preventDefault()

    if (POSSIBLE_ACTIONS.includes(action)) {
      channel.push(`device:${action}`, { device_uuid: device.device_uuid })
    }
  }

  render() {
    const {device} = this.props

    return (
      <div ref="deviceApprovalModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request for authentication</h5>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <h5>Location</h5>
                  <div>{device.geocode_data.ip}</div>
                  <div>{device.geocode_data.longitude}</div>
                  <div>{device.geocode_data.latitude}</div>
                  <div>{device.geocode_data.country_name}</div>
                </div>
                <div className="col">
                  <h5>Browser</h5>
                  {
                    ['mobile', 'tablet', 'desktop'].includes(device.browser.device_type) &&
                      <Icon name={device.browser.device_type} />
                  }
                  <div>{device.browser.full_browser_name}</div>
                  <div>{device.browser.full_platform_name}</div>
                </div>
              </div>
              <p className="mt-3">Device: {device.device_uuid}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={ event => this.handleClick(event, 'deny')  }
                data-dismiss="modal"
              >Deny</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={ event => this.handleClick(event, 'approve')  }
                data-dismiss="modal"
              >Approve</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
  }, dispatch)
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveDevice)

ApproveDevice.defaultProps = {
  device: {
    browser: { full_platform_name: "MacOS 10.12.6 Sierra", full_browser_name: "Safari 11.0.1", device_type: "desktop" },
    device_uuid: "93e9ae65-ce08-431a-bbc5-2974deb436a6",
    geocode_data: {
      city: "",
      country_code: "SE",
      country_name: "Sweden",
      ip: "155.4.235.182",
      latitude: 59.3247,
      longitude: 18.056,
      metro_code: 0,
      region_code: "",
      region_name: "",
      time_zone: "Europe/Stockholm",
      zip_code: ""
    }
  }
}

