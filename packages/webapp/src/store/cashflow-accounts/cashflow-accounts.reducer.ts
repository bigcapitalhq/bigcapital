import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface CashflowAccountsState {
  tableState: Partial<TableQuery>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 9999,
  pageIndex: 0,
  filterRoles: [],
};

const initialState: CashflowAccountsState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:cashflow_accounts';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('CASHFLOW_ACCOUNTS', defaultTableQuery),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const cashflowAccountsPersistReducer = persistReducer(CONFIG, reducerInstance);
