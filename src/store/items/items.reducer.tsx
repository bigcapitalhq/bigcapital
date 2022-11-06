// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';
import t from '@/store/types';

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  inactiveMode: false,
  viewSlug: null,
};

const initialState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:items';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS', defaultTableQuery),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(
  CONFIG,
  reducerInstance,
);