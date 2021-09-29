import { combineReducers } from 'redux';
import channels, { actions as channelsActions } from './channelsSlice.js';
import messages, { actions as messagesActions } from './messagesSlice.js';
import modals, { actions as modalsActions } from './modalsSlice.js';

export const actions = { ...channelsActions, ...messagesActions, ...modalsActions };

export default combineReducers({
  channels,
  messages,
  modals,
});
