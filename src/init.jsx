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
import reducer, { actions } from './slices/index.js';

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
  const isUserLogged = !!localStorage.userData;
  const [loggedIn, setLoggedIn] = useState(isUserLogged);

  const logIn = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn,
      logIn,
      logOut,
      userData: localStorage.userData ? JSON.parse(localStorage.userData) : null,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const makeSocketApiMethod = (fn) => (...args) => new Promise((resolve, reject) => {
  // eslint-disable-next-line functional/no-let
  let state = 'pending';

  setTimeout(() => {
    if (state === 'pending') {
      state = 'rejected';
      reject();
    }
  }, 10000);

  const ack = (response) => {
    if (state === 'pending') {
      state = 'resolved';
      resolve(response);
    }
  };
  fn(...args, ack);
});

const SocketProvider = ({ socket, children }) => (
  <socketContext.Provider value={{
    newMessage: makeSocketApiMethod((...args) => socket.emit('newMessage', ...args)),
    newChannel: makeSocketApiMethod((...args) => socket.emit('newChannel', ...args)),
    removeChannel: makeSocketApiMethod((...args) => socket.emit('removeChannel', ...args)),
    renameChannel: makeSocketApiMethod((...args) => socket.emit('renameChannel', ...args)),
  }}
  >
    { children }
  </socketContext.Provider>
);

export default async (socket) => {
  const newInstance = i18n.createInstance();
  await newInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      fallbackLng: 'ru',
      resources: locales,
      interpolation: {
        escapeValue: false,
      },
    });

  socket.on('newChannel', (channel) => {
    store.dispatch(actions.addChannel({ channel }));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannel({ id }));
  });

  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(actions.renameChannel({ id, name }));
  });

  socket.on('newMessage', (message) => {
    store.dispatch(actions.addMessage({ message }));
  });

  return (
    <ProviderRollbar config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={newInstance}>
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
