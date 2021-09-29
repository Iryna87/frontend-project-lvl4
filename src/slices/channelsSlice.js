/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const defaultChannelId = 1;
const initialState = { channels: [], currentChannelId: null };

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // данные сервера
    initialize(state, { payload: { data } }) {
      state.channels = data.channels;
      state.currentChannelId = data.currentChannelId;
    },
    addChannel: (state, { payload: { channel } }) => {
      state.channels.push(channel);
    },
    removeChannel: (state, { payload: { id } }) => {
      _.remove(state.channels, (channel) => channel.id === id);
      if (id === state.currentChannelId) {
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel: (state, { payload: { id, name } }) => {
      const channelToRename = _.find(state.channels, (channel) => channel.id === id);
      channelToRename.name = name;
    },
    changeCurrentChannelId: (state, { payload: { id } }) => {
      state.currentChannelId = parseInt(id, 10);
    },
  },
});

export const { actions } = channelSlice;
export default channelSlice.reducer;
