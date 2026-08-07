import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET, PAYMENT_RECEIVES_SET_SELECTED_ROWS } from '@/store/types';

interface PaymentReceivesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: PaymentReceivesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:paymentReceives';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('PAYMENT_RECEIVES', defaultTableQuery),

  [PAYMENT_RECEIVES_SET_SELECTED_ROWS]: (
    state: PaymentReceivesState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const paymentReceivesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
