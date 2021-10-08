import React from 'react';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useAuth } from '../hooks';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Home from './Home.jsx';
import ComponentError from './ComponentError.jsx';
import NotFound from './NotFound.jsx';
import ModalComponent from './Modal.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ children, path }) => {
  const { loggedIn } = useAuth();
  return (
    <Route
      path={path}
      render={() => (loggedIn ? children : <Redirect to={{ pathname: '/login' }} />)}
    />
  );
};

const App = () => (
  <Router>
    <div className="d-flex flex-column h-100">
      <Switch>
        <Route path={routes.exampleErrorPagePath()}>
          <ComponentError />
        </Route>
        <Route path={routes.signupPagePath()}>
          <SignUp />
        </Route>
        <Route path={routes.loginPagePath()}>
          <Login />
        </Route>
        <PrivateRoute path={routes.homePagePath()}>
          <Home />
        </PrivateRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      <ModalComponent />
    </div>
  </Router>
);

export default App;
