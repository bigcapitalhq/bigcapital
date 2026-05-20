import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET, EXPENSES_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface ExpensesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

// Default table query.
export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

// Initial state.
const initialState: ExpensesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:expenses';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('EXPENSES', defaultTableQuery),

  [EXPENSES_SET_SELECTED_ROWS]: (state: ExpensesState, action: { payload: Array<unknown> }) => {
    state.selectedRows = action.payload;
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const expensesPersistReducer = persistReducer(CONFIG, reducerInstance);
