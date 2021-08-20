/* eslint-disable max-len */
// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import Rollbar from 'rollbar';
import { authContext, socketContext } from './contexts/index.jsx';
import App from './components/App.jsx';
import reducer from './components/reducers.jsx';
import {
  addChannel, removeChannel, addMessage, removeMessage, changeId, renameChannel,
} from './components/actions.jsx';

const production = process.env.NODE_ENV === 'production';

const rollbar = new Rollbar({
  enabled: !!production,
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
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
  const tokenStorage = !!localStorage.userId;
  const [loggedIn, setLoggedIn] = useState(tokenStorage);

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

const SocketProvider = ({ socket, children }) => (
  <socketContext.Provider value={{
    newMessage: (data) => {
      socket.emit(
        'newMessage',
        data,
        () => {},
      );
    },
    newChannel: (data) => {
      socket.emit(
        'newChannel',
        data,
        () => {},
      );
    },
    removeChannel: (data) => {
      socket.emit(
        'removeChannel',
        data,
        () => {},
      );
    },
    renameChannel: (data) => {
      socket.emit(
        'renameChannel',
        data,
        () => {},
      );
    },
  }}
  >
    { children }
  </socketContext.Provider>
);

export default async (socket) => {
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

  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider socket={socket}>
          <App />
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
};
