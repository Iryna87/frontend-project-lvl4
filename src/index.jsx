// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import App from './components/App.jsx';
import reducer from './components/reducers.jsx';
import {
  fetchChannels, addChannel, removeChannel, addMessage, removeMessage, changeId, renameChannel,
} from './components/actions.jsx';

const socket = io();

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

store.dispatch(fetchChannels());

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
    <App socket={socket} />
  </Provider>,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
