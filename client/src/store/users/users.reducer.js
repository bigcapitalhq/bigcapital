import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  list: {},
  userById: {},
  loading: false,
};

export default createReducer(initialState, {
  [t.USERS_LIST_SET]: (state, action) => {
    state.list = action.users;
  },

  [t.USER_DETAILS_SET]: (state, action) => {
    state.userById[action.user.id] = action.user;
  },

  [t.USERS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = !!loading;
  },
});

/**
 * Retrieve the user details of the given user id,
 * @param {Object} state
 * @param {Numeric} id
 */
export const getUserDetails = (state, id) => {
  return state.users.userById[id];
};
