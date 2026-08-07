import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RECEIPTS_SELECTED_ROWS_SET, RESET } from '@/store/types';

interface ReceiptsState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: ReceiptsState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:receipts';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('RECEIPTS', defaultTableQuery),

  [RECEIPTS_SELECTED_ROWS_SET]: (
    state: ReceiptsState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const salesReceiptsPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
