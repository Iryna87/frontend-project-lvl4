import _ from 'lodash';
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
  [actions.addMessageSuccess](state, { payload: { message } }) {
    const { byCurrentChannelId, allIds } = state;
    return {
      byCurrentChannelId: { ...byCurrentChannelId, [message.id]: message },
      allIds: [message.id, ...allIds],
    };
  },
  [actions.removeMessageSuccess](state, { payload: { id } }) {
    const { byCurrentChannelId, allIds } = state;
    return {
      byCurrentChannelId: _.omit(byCurrentChannelId, id),
      allIds: _.without(allIds, id),
    };
  },
}, {
  messages: [], byCurrentChannelId: {}, allIds: [],
});

const channels = handleActions({
  [actions.fetchChannelsSuccess](state, { payload }) {
    return payload.data.channels;
  },
  [actions.addChannelSuccess](state, { payload: { channel } }) {
    return { ...channels, [channel.id]: channel };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    return _.omit(channels, id);
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
  currentId,
});
