// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from '@/store/queryReducers';
import t from '@/store/types';

const initialState = {
  items: {},
  userById: {},
  loading: false,
};

export default createReducer(initialState, {
  [t.USERS_LIST_SET]: (state, action) => {
    const { users } = action.payload;
    const _users = {};

    users.forEach((user) => {
      _users[user.id] = {
        ...user,
      };
    });
    state.items = {
      ...state.items,
      ..._users,
    };
  },

  [t.USER_DETAILS_SET]: (state, action) => {
    const { id, user } = action.payload;
    const _user = state.items[id] || {};
    state.items[id] = { ..._user, ...user };
  },

  [t.USERS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },
  [t.USER_DELETE]: (state, action) => {
    const { id } = action.payload;
    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  ...createTableQueryReducers('USERS'),
});

/**
 * Retrieve the user details of the given user id,
 * @param {Object} state
 * @param {Numeric} id
 */
export const getUserDetails = (state, id) => {
  return state.users.userById[id];
};
