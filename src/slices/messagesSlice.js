/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, { payload: { id } }) => {
        _.remove(state.messages, (message) => message.channelId === id);
      })
      .addCase(channelsActions.initialize, (state, { payload: { data } }) => {
        state.messages = data.messages;
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
