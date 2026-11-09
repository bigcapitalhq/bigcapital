import { PayloadAction, createReducer } from '@reduxjs/toolkit';
import { isUndefined } from 'lodash';
import { persistReducer } from 'redux-persist';
import purgeStoredState from 'redux-persist/es/purgeStoredState';
import storage from 'redux-persist/lib/storage';
import {
  AUTH_LOGIN_CLEAR_ERRORS,
  AUTH_LOGIN_FAILURE,
  AUTH_SET_AUTH_TOKEN,
  AUTH_SET_EMAIL_VERIFIED,
  AUTH_SET_ORGANIZATIOIN_ID,
  AUTH_SET_USER_ID,
  RESET,
} from '@/store/types';
import { getCookie } from '@/utils';

export interface AuthenticationState {
  token: string | null;
  organizationId: string | null;
  userId: string | null;
  locale: string;
  verified: boolean;
  verifyEmail: string | null;
  errors: Array<{ type: string; [key: string]: unknown }>;
}

const initialState: AuthenticationState = {
  token: getCookie('token', null) || null,
  organizationId: getCookie('organization_id', null) || null,
  userId: getCookie('authenticated_user_id', null) || null,
  locale: getCookie('locale', 'en') as string,
  verified: true,
  verifyEmail: null,
  errors: [],
};

const STORAGE_KEY = 'bigcapital:authentication';
const CONFIG = { key: STORAGE_KEY, whitelist: [], storage };

const reducerInstance = createReducer(initialState, {
  [AUTH_LOGIN_FAILURE]: (
    state: AuthenticationState,
    action: { errors: Array<{ type: string; [key: string]: unknown }> },
  ) => {
    state.errors = action.errors;
  },

  [AUTH_LOGIN_CLEAR_ERRORS]: (state: AuthenticationState) => {
    state.errors = [];
  },

  [AUTH_SET_EMAIL_VERIFIED]: (
    state: AuthenticationState,
    action: PayloadAction<{ verified?: boolean; email?: string }>,
  ) => {
    state.verified = !isUndefined(action.payload.verified)
      ? action.payload.verified!
      : true;
    state.verifyEmail = action.payload.email || null;

    if (state.verified) {
      state.verifyEmail = null;
    }
  },

  [AUTH_SET_AUTH_TOKEN]: (
    state: AuthenticationState,
    action: PayloadAction<{ token: string }>,
  ) => {
    state.token = action.payload.token;
  },

  [AUTH_SET_ORGANIZATIOIN_ID]: (
    state: AuthenticationState,
    action: PayloadAction<{ organizationId: string }>,
  ) => {
    state.organizationId = action.payload.organizationId;
  },

  [AUTH_SET_USER_ID]: (
    state: AuthenticationState,
    action: PayloadAction<{ userId: string }>,
  ) => {
    state.userId = action.payload.userId;
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const authenticationPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);

export const isAuthenticated = (state: {
  authentication: AuthenticationState;
}) => !!state.authentication.token;

export const hasErrorType = (
  state: { authentication: AuthenticationState },
  errorType: string,
) => state.authentication.errors.find((e) => e.type === errorType);
