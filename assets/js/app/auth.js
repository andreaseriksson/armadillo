import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Socket} from 'phoenix';
import {Redirect} from 'react-router-dom';
import {connectToAuthChannel} from './actions';
import ApproveDevice from './approve_device';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: undefined,
      displayApproveDeviceModal: false,
      device_uuid: null,
    };
  }

  get online() {
    return navigator.onLine;
  }

  get loggedIn() {
    const {app} = this.props;

    if (this.online) {
      return app.jsonWebToken;
    } else {
      return app.jsonWebToken;
    }
  }

  componentWillMount() {
    const {app, dispatch} = this.props;

    if (app.jsonWebToken && !app.loggedIn) {
      this.refreshToken();
    }
  }

  render() {
    const {displayApproveDeviceModal, channel, device} = this.state;
    if (!this.loggedIn) {
      return <Redirect to={{pathname: '/login'}} />;
    } else {
      return this.props.children;
    }
    // return (
    //   <div>
    //     {this.props.children}
    //     {displayApproveDeviceModal && (
    //       <ApproveDevice channel={channel} device={device} />
    //     )}
    //   </div>
    // );
  }

  // Refresh the jst from the server through a websocket connection
  refreshToken() {
    const {socket, history, connectToAuthChannel} = this.props;
    let channel = connectToAuthChannel(socket, history);
    const that = this;
    this.setState({channel});
    channel.on('device:request', device => {
      console.log(device);

      that.setState({
        displayApproveDeviceModal: true,
        device,
        channel,
      });
      // channel.push('device:approve', { device: event.device })
    });
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      connectToAuthChannel,
    },
    dispatch,
  );
};

const mapStateToProps = state => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
/*
{
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
*/
