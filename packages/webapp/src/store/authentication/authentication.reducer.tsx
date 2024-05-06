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
  token: getCookie('token'),
  organizationId: getCookie('organization_id'),
  tenantId: getCookie('tenant_id'),
  userId: getCookie('authenticated_user_id'),
  locale: getCookie('locale'),
  verified: true, // Let's be optimistic and assume the user's email is confirmed.
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
    payload: PayloadAction<{ verified?: boolean }>,
  ) => {
    state.verified = !isUndefined(payload.action.verified)
      ? payload.action.verified
      : true;
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
