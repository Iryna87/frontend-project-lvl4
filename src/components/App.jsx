import React from 'react';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/index.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Home from './Home.jsx';
import ComponentError from './Component.jsx';
import NotFound from './NotFound.jsx';
import ModalComponent from './Modal.jsx';
import routes from '../routes.js';
import { actions } from '../slices/index.js';

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();
  return (
    <Route
      path={path}
      render={() => (auth.loggedIn ? children : <Redirect to={{ pathname: '/login' }} />)}
    />
  );
};

const App = () => {
  const dispatch = useDispatch();
  const addChannelModal = () => dispatch(actions.showModal({ type: 'adding' }));
  const removeChannelModal = (id) => dispatch(actions.showModal({ type: 'removing', extraData: id }));
  const renameChannelModal = () => dispatch(actions.showModal({ type: 'renaming' }));

  return (
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
            <Home
              addChannelModal={addChannelModal}
              removeChannelModal={removeChannelModal}
              renameChannelModal={renameChannelModal}
            />
          </PrivateRoute>
          <Route component={NotFound} />
        </Switch>
        <ModalComponent />
      </div>
    </Router>
  );
};

export default App;
