import { createReducer } from '@reduxjs/toolkit';

export default createReducer([], (builder) => {
  builder
    .addCase('ADD_TODO', (state, action) => {
      state.push(action.payload);
    })
    .addCase('REMOVE_TODO', (state, action) => {
      const todo = state[action.payload.index];
      todo.completed = !todo.completed;
    });
});
