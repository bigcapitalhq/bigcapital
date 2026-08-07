import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  CUSTOMERS_SET_SELECTED_ROWS,
  CUSTOMERS_RESET_SELECTED_ROWS,
} from '@/store/types';

interface CustomersState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

// Default table query state.
export const defaultTableQueryState: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

// initial data.
const initialState: CustomersState = {
  tableState: defaultTableQueryState,
  selectedRows: [],
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('CUSTOMERS', defaultTableQueryState),

  [CUSTOMERS_SET_SELECTED_ROWS]: (
    state: CustomersState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [CUSTOMERS_RESET_SELECTED_ROWS]: (state: CustomersState) => {
    state.selectedRows = [];
  },

  [RESET]: () => initialState,
});

const STORAGE_KEY = 'bigcapital:estimates';

export const customersPersistReducer = persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: [],
    storage,
  },
  reducerInstance,
);
