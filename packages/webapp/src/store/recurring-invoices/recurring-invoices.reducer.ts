import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  RECURRING_INVOICES_RESET_SELECTED_ROWS,
  RECURRING_INVOICES_SET_SELECTED_ROWS,
} from '@/store/types';

interface RecurringInvoicesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: RecurringInvoicesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:recurring-invoices';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('RECURRING_INVOICES', defaultTableQuery),

  [RECURRING_INVOICES_SET_SELECTED_ROWS]: (
    state: RecurringInvoicesState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [RECURRING_INVOICES_RESET_SELECTED_ROWS]: (state: RecurringInvoicesState) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const recurringInvoicesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
