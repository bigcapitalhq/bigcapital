import { createReducer } from '@reduxjs/toolkit';
import type { UsersState } from './users.types';
import {
  USERS_LIST_SET,
  USERS_TABLE_LOADING,
  USER_DELETE,
  USER_DETAILS_SET,
} from '@/store/types';

interface UserRecord {
  id: string | number;
  [key: string]: unknown;
}

const initialState: UsersState = {
  items: {},
  userById: {},
  loading: false,
};

export const usersReducer = createReducer(initialState, {
  [USERS_LIST_SET]: (
    state,
    action: { type: string; payload: { users: Array<UserRecord> } },
  ) => {
    const { users } = action.payload;
    const _users: Record<string, UserRecord> = {};

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

  [USER_DETAILS_SET]: (
    state,
    action: {
      type: string;
      payload: { id: string | number; user: Record<string, unknown> };
    },
  ) => {
    const { id, user } = action.payload;
    const _user = (state.items[id] as Record<string, unknown>) || {};
    state.items[id] = { ..._user, ...user };
  },

  [USERS_TABLE_LOADING]: (
    state,
    action: { type: string; payload: { loading: boolean } },
  ) => {
    const { loading } = action.payload;
    state.loading = loading;
  },
  [USER_DELETE]: (
    state,
    action: { type: string; payload: { id: string | number } },
  ) => {
    const { id } = action.payload;
    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },
});

/**
 * Retrieve the user details of the given user id,
 * @param {Object} state
 * @param {Numeric} id
 */
export const getUserDetails = (
  state: { users: UsersState },
  id: string | number,
) => {
  return state.users.userById[id];
};
