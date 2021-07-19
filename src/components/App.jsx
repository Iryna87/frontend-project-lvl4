import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import NotFound from './NotFound.jsx';

const AuthProvider = ({ children }) => {
  const token = !!localStorage.userId;
  const [loggedIn, setLoggedIn] = useState(token);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path }) => {
  //console.log(localStorage);
  const auth = useAuth();
  return (
    <Route
      path={path}
      render={() => auth.loggedIn ? children : <Redirect to={{ pathname: '/login' }} />}
    />
  );
};

export default function App({ socket }) {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Nav className="mr-auto">
            <ul>
              <li>
                <Nav.Link as={Link} to="/">/</Nav.Link>
              </li>
              <li>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </li>
            </ul>
          </Nav>

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/">
              <Home socket={socket} />
            </PrivateRoute>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}
