// @ts-nocheck
import { PayloadAction, createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import purgeStoredState from 'redux-persist/es/purgeStoredState';
import storage from 'redux-persist/lib/storage';
import { isUndefined } from 'lodash';
import { getCookie } from '@/utils';
import t from '@/store/types';

// Read stored data in cookies and merge it with the initial state.
const initialState = {
  token: getCookie('token') || null,
  organizationId: getCookie('organization_id') || null,
  tenantId: getCookie('tenant_id') || null,
  userId: getCookie('authenticated_user_id') || null,
  locale: getCookie('locale') || 'en',
  verified: true, // Let's be optimistic and assume the user's email is confirmed.
  verifyEmail: null,
  errors: [],
};

const STORAGE_KEY = 'bigcapital:authentication';
const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  [t.LOGIN_FAILURE]: (state, action) => {
    state.errors = action.errors;
  },

  [t.LOGIN_CLEAR_ERRORS]: (state) => {
    state.errors = [];
  },

  [t.SET_EMAIL_VERIFIED]: (
    state,
    payload: PayloadAction<{ verified?: boolean; email?: string }>,
  ) => {
    state.verified = !isUndefined(payload.action.verified)
      ? payload.action.verified
      : true;
    state.verifyEmail = payload.action.email || null;

    if (state.verified) {
      state.verifyEmail = null;
    }
  },

  [t.SET_AUTH_TOKEN]: (state, payload: PayloadAction<{ token: string }>) => {
    state.token = payload.action.token;
  },

  [t.SET_ORGANIZATIOIN_ID]: (
    state,
    payload: PayloadAction<{ organizationId: string }>,
  ) => {
    state.organizationId = payload.action.organizationId;
  },

  [t.SET_TENANT_ID]: (state, payload: PayloadAction<{ tenantId: string }>) => {
    state.tenantId = payload.action.tenantId;
  },

  [t.SET_USER_ID]: (state, payload: PayloadAction<{ userId: string }>) => {
    state.userId = payload.action.userId;
  },

  [t.RESET]: (state) => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(CONFIG, reducerInstance);

export const isAuthenticated = (state) => !!state.authentication.token;
export const hasErrorType = (state, errorType) => {
  return state.authentication.errors.find((e) => e.type === errorType);
};

export const isTenantSeeded = (state) => !!state.tenant.seeded_at;
export const isTenantBuilt = (state) => !!state.tenant.initialized_at;

export const isTenantHasSubscription = () => false;
export const isTenantSubscriptionExpired = () => false;
