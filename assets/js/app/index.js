import React from 'react'
import {
	BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {socket} from './socket'
import Auth from './auth'
import Secrets from './containers/secrets'
import Login from './containers/login'
import Logout from './containers/logout'
import Register from './containers/register'

const App = () => (
  <Router>
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <Link to="/" className="navbar-brand">Armadillo Password Manager</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Logout />
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main role="main" className="container">
        <Route exact
          path="/"
          render={props => (
            <Auth socket={socket} {...props}>
              <Secrets socket={socket} {...props} />
            </Auth>
          )}
        />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </main>
    </div>
  </Router>
)

export default App
