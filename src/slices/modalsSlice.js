/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { type: null, isOpen: false, extraData: null };

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload: { type, extraData = null } }) => {
      state.type = type;
      state.extraData = extraData;
      state.isOpen = true;
    },
    hideModal: (state) => {
      state.type = null;
      state.extraData = null;
      state.isOpen = false;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
