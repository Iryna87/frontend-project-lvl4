import React, { useEffect } from 'react';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
  // useHistory,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useAuth } from '../hooks/index.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Home from './Home.jsx';
import ComponentError from './Component.jsx';
import NotFound from './NotFound.jsx';
import getModal from './modals/index.js';
import routes from '../routes.js';
import { actions } from '../slices/index.js';

const renderModal = (modals, hideModal) => {
  if (!modals.type) {
    return null;
  }
  const Component = getModal(modals.type);
  return (
    <Component
      modals={modals}
      hideModal={hideModal}
    />
  );
};

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
  const modals = useSelector((state) => state.modals.modals);
  const auth = useAuth();
  // const history = useHistory();

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

  useEffect(async () => {
    try {
      const response = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      dispatch(actions.initialize({ data: response.data }));
    } catch (err) {
      if (err.isAxiosError && err.response.status === 401) {
        // history.push(routes.loginPagePath());
      } else {
        throw err;
      }
    }
  }, [auth.userData?.username, dispatch]);

  const addChannelModal = () => dispatch(actions.showModal({ type: 'adding' }));
  const removeChannelModal = (id) => dispatch(actions.showModal({ type: 'removing', channel: id }));
  const renameChannelModal = (id, name) => dispatch(actions.showModal({ type: 'renaming', channel: id, name }));
  const hideModal = () => dispatch(actions.hideModal({}));

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
              hideModal={hideModal}
            />
          </PrivateRoute>
          <Route component={NotFound} />
        </Switch>
        {renderModal(modals, hideModal)}
      </div>
    </Router>
  );
};

export default App;
