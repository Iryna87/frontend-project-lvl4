#!/usr/bin/env node
/* eslint-disable max-len */
// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import Rollbar from 'rollbar';
import authContext from './contexts/index.jsx';
import App from './components/App.jsx';
import reducer from './components/reducers.jsx';
import {
  addChannel, removeChannel, addMessage, removeMessage, changeId, renameChannel,
} from './components/actions.jsx';

const socket = io();

const rollbar = new Rollbar({
  accessToken: '84a20308b13a42f18039aef07572e80b',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

rollbar.log('Hello world!');

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

const AuthProvider = ({ children }) => {
  const token = !!localStorage.userId;
  const [loggedIn, setLoggedIn] = useState(token);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, userData: localStorage.userId ? JSON.parse(localStorage.userId) : null,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default () => {
  socket.on('newChannel', async (channel) => {
    await store.dispatch(addChannel(channel))
      .catch(() => {
        throw new Error();
      });
    await store.dispatch(changeId(parseInt(channel.id, 10)))
      .catch(() => {
        throw new Error();
      });
  });

  socket.on('removeChannel', async ({ id }) => {
    await store.dispatch(removeChannel({ id }))
      .catch(() => {
        throw new Error();
      });
    await store.dispatch(removeMessage({ id }))
      .catch(() => {
        throw new Error();
      });
  });

  socket.on('renameChannel', async ({ id, name }) => {
    await store.dispatch(renameChannel({ id, name }));
  });

  socket.on('newMessage', async (message) => {
    try {
      await store.dispatch(addMessage({ message }));
    } catch (err) {
      throw new Error();
    }
  });

  ReactDOM.render(
    <Provider store={store}>
      <AuthProvider>
        <App socket={socket} />
      </AuthProvider>
    </Provider>,
    document.querySelector('#chat'),
  );
};
