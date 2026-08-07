import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET, MANUAL_JOURNALS_SET_SELECTED_ROWS } from '@/store/types';

interface ManualJournalsState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: ManualJournalsState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:manualJournals';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('MANUAL_JOURNALS', defaultTableQuery),

  [MANUAL_JOURNALS_SET_SELECTED_ROWS]: (
    state: ManualJournalsState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [RESET]: (): void => {
    purgeStoredState(CONFIG);
  },
});

export const manualJournalsPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
