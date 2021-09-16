/* eslint-disable max-len */
// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';
import locales from './locales/index.js';
import { authContext, socketContext } from './contexts/index.jsx';
import App from './components/App.jsx';
import reducer from './reducers/reducers.jsx';
import {
  addChannel, removeChannel, addMessage, removeMessage, renameChannel,
} from './actions/actions.jsx';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: locales,
    interpolation: {
      escapeValue: false,
    },
  });

const rollbarConfig = {
  enabled: false,
  environment: process.env.NODE_ENV,
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

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
    newMessage: (data) => new Promise((resolve) => {
      socket.emit(
        'newMessage',
        data,
        (response) => { resolve(response); },
      );
    }),
    newChannel: (data) => new Promise((resolve) => {
      socket.emit(
        'newChannel',
        data,
        (response) => { resolve(response); },
      );
    }),
    removeChannel: (data) => new Promise((resolve) => {
      socket.emit(
        'removeChannel',
        data,
        (response) => { resolve(response); },
      );
    }),
    renameChannel: (data) => new Promise((resolve) => {
      socket.emit(
        'renameChannel',
        data,
        (response) => { resolve(response); },
      );
    }),
  }}
  >
    { children }
  </socketContext.Provider>
);

export default async (socket) => {
  socket.on('newChannel', async (channel) => {
    await store.dispatch(addChannel(channel));
  });

  socket.on('removeChannel', async ({ id }) => {
    await store.dispatch(removeChannel({ id }));
    await store.dispatch(removeMessage({ id }));
  });

  socket.on('renameChannel', async ({ id, name }) => {
    await store.dispatch(renameChannel({ id, name }));
  });

  socket.on('newMessage', async (message) => {
    await store.dispatch(addMessage({ message }));
  });

  return (
    <ProviderRollbar config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AuthProvider>
              <SocketProvider socket={socket}>
                <App />
              </SocketProvider>
            </AuthProvider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </ProviderRollbar>
  );
};
