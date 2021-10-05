import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';
import { actions } from '../slices/index.js';
import {
  getChannels, getMessages, getCurrentChannelId, getCurrentChannel, getCurrentChannelMessages,
} from '../selectors.js';
import HeaderHome from './HeaderHome.jsx';
import ChannelsHome from './ChannelsHome.jsx';
import Chat from './ChatHome.jsx';

const Home = ({
  addChannelModal,
  removeChannelModal,
  renameChannelModal,
}) => {
  const channels = useSelector(getChannels);
  const currentId = useSelector(getCurrentChannelId);
  const messages = useSelector(getMessages);
  const currentChannel = useSelector(getCurrentChannel);
  const currentChannelMessages = useSelector(getCurrentChannelMessages);

  const dispatch = useDispatch();
  const auth = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    try {
      setLoading(true);
      const authHeader = auth.userData?.token ? { Authorization: `Bearer ${auth.userData.token}` } : {};
      const response = await axios.get(routes.dataPath(), { headers: authHeader });
      setLoading(false);
      dispatch(actions.initialize({ data: response.data }));
    } catch (err) {
      if (err.isAxiosError && err.response.status === 401) {
        history.push(routes.loginPagePath());
      } else {
        throw err;
      }
    }
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
          <HeaderHome />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            {loading ? spinner : (
              <div className="row h-100 bg-white flex-md-row">
                <ChannelsHome
                  addChannelModal={addChannelModal}
                  removeChannelModal={removeChannelModal}
                  renameChannelModal={renameChannelModal}
                  channels={channels}
                  currentId={currentId}
                />
                <Chat
                  currentChannel={currentChannel}
                  currentChannelMessages={currentChannelMessages}
                  channels={channels}
                  messages={messages}
                  currentId={currentId}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
