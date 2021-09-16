import _ from 'lodash';
import { createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const changeCurrentChannelIdSuccess = createAction('CHANGE_CURRENTCHANNEL_ID');

export const fetchChannelsRequest = createAction('CHANNELS_FETCH_REQUEST');
export const fetchChannelsSuccess = createAction('CHANNELS_FETCH_SUCCESS');
export const fetchChannelsFailure = createAction('CHANNELS_FETCH_FAILURE');

export const removeMessageRequest = createAction('MESSAGE_REMOVE_REQUEST');
export const removeMessageSuccess = createAction('MESSAGE_REMOVE_SUCCESS');
export const removeMessageFailure = createAction('MESSAGE_REMOVE_FAILURE');
export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');
export const renameChannelSuccess = createAction('CHANNEL_RENAME_SUCCESS');
export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');
export const addMessageSuccess = createAction('MESSAGE_ADD_SUCCESS');
export const addUserSuccess = createAction('USER_ADD_SUCCESS');

export const changeId = (id) => async (dispatch) => {
  dispatch(changeCurrentChannelIdSuccess({ id }));
};

export const addChannel = (channel) => async (dispatch) => {
  dispatch(addChannelSuccess({ channel }));
};
export const addMessage = ({ message }) => async (dispatch) => {
  dispatch(addMessageSuccess({ message }));
};

export const addUser = ({ body }) => async (dispatch) => {
  dispatch(addUserSuccess({ body }));
};

export const removeChannel = ({ id }) => async (dispatch) => {
  dispatch(removeChannelRequest());
  try {
    dispatch(removeChannelSuccess({ id }));
  } catch (e) {
    dispatch(removeChannelFailure());
    throw e;
  }
};

export const renameChannel = ({ id, name }) => async (dispatch) => {
  dispatch(renameChannelSuccess({ id, name }));
};

export const removeMessage = ({ id }) => async (dispatch) => {
  dispatch(removeMessageRequest());
  try {
    dispatch(removeMessageSuccess({ id }));
  } catch (e) {
    dispatch(removeMessageFailure());
    throw e;
  }
};

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

export const fetchChannels = () => async (dispatch) => {
  if (_.isEmpty(getAuthHeader())) {
    return;
  }
  dispatch(fetchChannelsRequest());
  try {
    const response = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
    dispatch(fetchChannelsSuccess({ data: response.data }));
  } catch (e) {
    dispatch(fetchChannelsFailure());
    throw e;
  }
};
