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
export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');
export const addMessageSuccess = createAction('MESSAGE_ADD_SUCCESS');

export const changeId = (id) => async (dispatch) => {
  dispatch(changeCurrentChannelIdSuccess({ id }));
};

export const addChannel = (channel) => async (dispatch) => {
  const response = await axios.post(routes.channelPath(), { channel });
  dispatch(addChannelSuccess({ channel: response.data }));
};
export const addMessage = ({ message }) => async (dispatch) => {
  const response = await axios.post(routes.tasksUrl(), { message });
  dispatch(addMessageSuccess({ message: response.data }));
};

export const removeMessage = (task) => async (dispatch) => {
  dispatch(removeMessageRequest());
  try {
    const url = routes.taskUrl(task.id);
    await axios.delete(url);
    dispatch(removeMessageSuccess({ id: task.id }));
  } catch (e) {
    dispatch(removeMessageFailure());
    throw e;
  }
};

export const removeChannel = (channel) => async (dispatch) => {
  dispatch(removeChannelRequest());
  try {
    const url = routes.taskUrl(channel.id);
    await axios.delete(url);
    dispatch(removeChannelSuccess({ id: channel.id }));
  } catch (e) {
    dispatch(removeChannelFailure());
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
  dispatch(fetchChannelsRequest());
  try {
    const response = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
    dispatch(fetchChannelsSuccess({ data: response.data }));
  } catch (e) {
    dispatch(fetchChannelsFailure());
    throw e;
  }
};
