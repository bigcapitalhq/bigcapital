import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';

interface InventoryAdjustmentsState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

const defaultTableQuery: Partial<TableQuery> = {
  pageSize: 20,
  pageIndex: 0,
  sortBy: [],
  filterRoles: [],
};

const initialState: InventoryAdjustmentsState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:inventoryAdjustments';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: ['tableState'],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('INVENTORY_ADJUSTMENTS', defaultTableQuery),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const inventoryAdjustmentsPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
