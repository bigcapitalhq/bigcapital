// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/tableState.reducer';
import t from '@/store/types';

export const defaultTableQueryState = {
  pageSize: 20,
  pageIndex: 0,
  inactiveMode: false,
  filterRoles: [],
  viewSlug: null,
};

const initialState = {
  tableState: defaultTableQueryState,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:vendors';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('VENDORS', defaultTableQueryState),

  ['VENDORS/SET_SELECTED_ROWS']: (state, action) => {
    state.selectedRows = action.payload;
  },

  ['VENDORS/RESET_SELECTED_ROWS']: (state) => {
    state.selectedRows = [];
  },

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
    return initialState;
  },
});

export default persistReducer(CONFIG, reducerInstance);
