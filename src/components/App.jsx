import React, { useState, useEffect } from 'react';
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
import getModal from './modals/index.js';
import { fetchChannels } from '../actions/actions.jsx';

const renderModal = (modalData, hideModal) => {
  if (!modalData.type) {
    return null;
  }
  const Component = getModal(modalData.type);
  return (
    <Component
      modalData={modalData}
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
  const auth = useAuth();
  useEffect(() => {
    dispatch(fetchChannels());
  }, [auth.userData?.username, dispatch]);

  const [modalData, setModalData] = useState({ type: null, channel: null });
  const showModal = (type, channel = null) => setModalData({ type, channel });
  const hideModal = () => setModalData({ type: null, channel: null });

  const addChannelModal = () => showModal('adding');
  const removeChannelModal = (id) => showModal('removing', { id });
  const renameChannelModal = (id, name) => showModal('renaming', { id, name });

  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Switch>
          <Route path="/example-error">
            <ComponentError />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/">
            <Home
              addChannelModal={addChannelModal}
              removeChannelModal={removeChannelModal}
              renameChannelModal={renameChannelModal}
            />
          </PrivateRoute>
          <Route component={NotFound} />
        </Switch>
        {renderModal(modalData, hideModal)}
      </div>
    </Router>
  );
};

export default App;
