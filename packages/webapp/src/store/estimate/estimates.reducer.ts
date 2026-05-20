import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET, ESTIMATES_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface EstimatesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: EstimatesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:estimates';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ESTIMATES', defaultTableQuery),

  [ESTIMATES_SET_SELECTED_ROWS]: (state: EstimatesState, action: { payload: Array<unknown> }) => {
    state.selectedRows = action.payload;
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const salesEstimatesPersistReducer = persistReducer(CONFIG, reducerInstance);
