// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import t from '@/store/types';

const initialState = {
  data: {},
};

export default createReducer(initialState, {
  ['GLOBAL_ERRORS_SET']: (state, action) => {
    const { errors } = action.payload;
    
    state.data = {
      ...state.data,
      ...errors,
    };
  },
});
