import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

export default createReducer(initialState, {
  [t.OPEN_SEARCH]: (state, action) => {
    state.isOpen = true;
  },
  [t.CLOSE_SEARCH]: (state, action) => {
    state.isOpen = false;
  },
});
