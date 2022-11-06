// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';
import t from '@/store/types';

export const defaultTableQuery = {
  filterRoles: [],
};

const initialState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:cashflow_accounts';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('CASHFLOW_ACCOUNTS', defaultTableQuery),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(CONFIG, reducerInstance);
