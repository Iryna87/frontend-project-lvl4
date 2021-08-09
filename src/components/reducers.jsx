import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from './actions.jsx';

const channelsFetchingState = handleActions({
  [actions.fetchChannelsRequest]() {
    return 'requested';
  },
  [actions.fetchChannelsFailure]() {
    return 'failed';
  },
  [actions.fetchChannelsSuccess]() {
    return 'finished';
  },
}, 'none');

const messageRemovingState = handleActions({
  [actions.removeMessageRequest]() {
    return 'requested';
  },
  [actions.removeMessageFailure]() {
    return 'failed';
  },
  [actions.removeMessageSuccess]() {
    return 'finished';
  },
}, 'none');

const channelRemovingState = handleActions({
  [actions.removeChannelRequest]() {
    return 'requested';
  },
  [actions.removeChannelFailure]() {
    return 'failed';
  },
  [actions.removeChannelSuccess]() {
    return 'finished';
  },
}, 'none');

const messages = handleActions({
  [actions.fetchChannelsSuccess](state, { payload }) {
    return payload.data.messages;
  },
  [actions.addMessageSuccess](state, { payload: { message } }) {
    return [...state, message];
  },
  [actions.removeMessageSuccess](state, { payload: { id } }) {
    return state.filter((message) => message.channelId !== id);
  },
}, []);

const channels = handleActions({
  [actions.fetchChannelsSuccess](state, { payload }) {
    return payload.data.channels;
  },
  [actions.addChannelSuccess](state, { payload: { channel } }) {
    return [...state, channel];
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    return state.filter((channel) => channel.id !== id);
  },
  [actions.renameChannelSuccess](state, { payload: { id, name } }) {
    return state.map((channel) => {
      if (channel.id === id) {
        // eslint-disable-next-line no-param-reassign
        channel.name = name;
        return channel;
      }
      return channel;
    });
  },
}, []);

const users = handleActions({
  [actions.fetchChannelsSuccess](state) {
    return state;
  },
  [actions.addUserSuccess](state, { payload: { body } }) {
    const newBody = JSON.parse(body);
    return [...state, newBody];
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    return state.filter((channel) => channel.id !== id);
  },
}, []);

const currentId = handleActions({
  [actions.fetchChannelsSuccess](state, { payload }) {
    return payload.data.currentChannelId;
  },
  [actions.changeCurrentChannelIdSuccess](state, { payload: { id } }) {
    return id;
  },
}, '');

export default combineReducers({
  channelsFetchingState,
  channelRemovingState,
  messageRemovingState,
  messages,
  channels,
  users,
  currentId,
});
