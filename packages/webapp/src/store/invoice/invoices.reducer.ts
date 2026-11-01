import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  INVOICES_SET_SELECTED_ROWS,
  INVOICES_RESET_SELECTED_ROWS,
} from '@/store/types';

interface InvoicesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: InvoicesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:invoices';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('INVOICES', defaultTableQuery),

  [INVOICES_SET_SELECTED_ROWS]: (
    state: InvoicesState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [INVOICES_RESET_SELECTED_ROWS]: (state: InvoicesState) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const salesInvoicesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
