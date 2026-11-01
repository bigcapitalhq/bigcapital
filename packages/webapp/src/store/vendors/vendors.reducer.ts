import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  VENDORS_SET_SELECTED_ROWS,
  VENDORS_RESET_SELECTED_ROWS,
} from '@/store/types';

interface VendorsState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQueryState: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: VendorsState = {
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

  [VENDORS_SET_SELECTED_ROWS]: (
    state: VendorsState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [VENDORS_RESET_SELECTED_ROWS]: (state: VendorsState) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
    return initialState;
  },
});

export const vendorsPersistReducer = persistReducer(CONFIG, reducerInstance);
