import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface PaymentMadesState {
  tableState: Partial<TableQuery>;
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
};

const STORAGE_KEY = 'bigcapital:paymentMades';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('PAYMENT_MADES', defaultTableQuery),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const paymentMadesPersistReducer = persistReducer(CONFIG, reducerInstance);
