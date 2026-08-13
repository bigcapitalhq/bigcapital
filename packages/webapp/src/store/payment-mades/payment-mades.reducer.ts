import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  PAYMENT_MADES_SET_SELECTED_ROWS,
  PAYMENT_MADES_RESET_SELECTED_ROWS,
} from '@/store/types';

interface PaymentMadesState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  sortBy: [],
  viewSlug: null,
};

const initialState: PaymentMadesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:paymentMades';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('PAYMENT_MADES', defaultTableQuery),

  [PAYMENT_MADES_SET_SELECTED_ROWS]: (
    state: PaymentMadesState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [PAYMENT_MADES_RESET_SELECTED_ROWS]: (state: PaymentMadesState) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const paymentMadesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
