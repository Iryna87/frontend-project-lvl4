// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import App from './components/App.jsx';
import * as reducers from './components/reducers.jsx';

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

const store = configureStore({
  reducer: { ...reducers, formReducer },
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
