import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';
import { actions } from '../slices/index.js';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    // eslint-disable-next-line functional/no-let
    let mounted = true;
    try {
      setLoading(true);
      const authHeader = auth.userData?.token ? { Authorization: `Bearer ${auth.userData.token}` } : {};
      const response = await axios.get(routes.dataPath(), { headers: authHeader });
      if (mounted === true) setLoading(false);
      dispatch(actions.initialize({ data: response.data }));
    } catch (err) {
      if (err.isAxiosError && err.response.status === 401) {
        history.push(routes.loginPagePath());
      } else {
        throw err;
      }
    }
    return () => {
      mounted = false;
    };
  }, [auth.userData?.username, dispatch]);

  const spinner = (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  return (
    <>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Header />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            {loading ? spinner : (
              <div className="row h-100 bg-white flex-md-row">
                <Channels />
                <Chat />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
