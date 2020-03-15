import {createReducer} from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  token: '',
  user: '',
  locale: '',
  errors: [],
};

export default createReducer(initialState, {
  [t.LOGIN_SUCCESS]: (state, action) => {
    state.token = action.token;
    state.user = action.user;
  },

  [t.LOGIN_FAILURE]: (state, action) => {
    state.errors = action.errors;
  },

  [t.LOGOUT]: (state) => {
    state.token = '';
    state.user = {};
  },

  [t.LOGIN_CLEAR_ERRORS]: (state) => {
    state.errors = [];
  },
});

export const isAuthenticated = (state) => !!state.authentication.token;
export const hasErrorType = (state, errorType) => {
  return state.authentication.errors.find(e => e.type === errorType);
};