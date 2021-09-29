/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { modals: { type: '', channel: '' } };

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload: { type, channel = null } }) => {
      state.modals = { type, channel };
    },
    hideModal: (state) => {
      state.modals = { type: null, channel: null };
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
