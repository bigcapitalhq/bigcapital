// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';

// Default table query state.
export const defaultTableQueryState = {
  pageSize: 20,
  pageIndex: 0,
  inactiveMode: false,
  filterRoles: [],
  viewSlug: null,
};

// initial data.
const initialState = {
  tableState: defaultTableQueryState,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('CUSTOMERS', defaultTableQueryState),
});

const STORAGE_KEY = 'bigcapital:estimates';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: [],
    storage,
  },
  reducerInstance,
);
