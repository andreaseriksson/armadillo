import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {socket} from './socket';
import Auth from './auth';
import Lock from './containers/lock';
import Secrets from './containers/secrets';
import Secret from './containers/secret';
import Login from './containers/login';
import Logout from './containers/logout';
import Register from './containers/register';

const App = () => (
  <Router>
    <div>
      <header>
        <nav className="navbar navbar-expand-md fixed-top navbar-dark text-center">
          <Link to="/" className="navbar-brand">
            Armadillo
          </Link>
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
        <PrivateRoute path="/" socket={socket} component={Secrets} />
        <PrivateRoute path="/secrets/:uuid" socket={socket} component={Secret} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </main>

      <footer className="footer">
        <div className="container">
          <span className="text-muted" />
        </div>
      </footer>
    </div>
  </Router>
);

export default App;

const PrivateRoute = ({ component: Component, path: path, socket: socket }) => (
  <Route
    exact
    path={path}
    render={props => (
      <Auth socket={socket} {...props}>
        <Lock {...props}>
          <Component socket={socket} {...props} />
        </Lock>
      </Auth>
    )}
  />
);
