import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

interface WarehouseTransferState {
  tableState: Partial<TableQuery>;
}

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: WarehouseTransferState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:warehouse_transfers';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('WAREHOUSE_TRANSFERS', defaultTableQuery),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const warehouseTransfersPersistReducer = persistReducer(CONFIG, reducerInstance);
