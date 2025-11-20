// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';
import t from '@/store/types';

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
  selectedRows: [],
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('CUSTOMERS', defaultTableQueryState),

  ['CUSTOMERS/SET_SELECTED_ROWS']: (state, action) => {
    state.selectedRows = action.payload;
  },

  ['CUSTOMERS/RESET_SELECTED_ROWS']: (state) => {
    state.selectedRows = [];
  },

  [t.RESET]: () => initialState,
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
