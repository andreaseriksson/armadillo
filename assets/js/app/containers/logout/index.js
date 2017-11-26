import React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LOGOUT_SUCCESS} from '../../constants'

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }
  }

  logout(event) {
    event.preventDefault()

    this.setState({clicked: true})

    this.props.dispatch({
      type: LOGOUT_SUCCESS
    })
  }

  render() {
    const {app} = this.props
    const {clicked} = this.state

    if (clicked) {
      return (<Redirect to={{ pathname: '/login' }} />)
    } else if (app.loggedIn) {
      return (
        <a href="/logout" className="nav-link" onClick={ event => this.logout(event) }>Logout</a>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(Logout)
