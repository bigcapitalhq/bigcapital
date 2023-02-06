// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';
import t from '@/store/types';

// Default table query.
export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

// Initial state.
const initialState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:expenses';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('EXPENSES', defaultTableQuery),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(CONFIG, reducerInstance);
