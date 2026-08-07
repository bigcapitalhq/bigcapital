import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET, ACCOUNTS_SET_SELECTED_ROWS } from '@/store/types';

interface AccountsState {
  tableState: Partial<TableQuery>;
  selectedRows: number[];
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
};

const initialState: AccountsState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:accounts';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ACCOUNTS', defaultTableQuery),

  [ACCOUNTS_SET_SELECTED_ROWS]: (
    state: AccountsState,
    action: { payload: number[] },
  ) => {
    state.selectedRows = action.payload;
  },

  [RESET]: (): void => {
    purgeStoredState(CONFIG);
  },
});

export const accountsPersistReducer = persistReducer(CONFIG, reducerInstance);
