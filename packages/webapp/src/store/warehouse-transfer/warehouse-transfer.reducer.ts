import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';
import {
  WAREHOUSE_TRANSFERS_SET_SELECTED_ROWS,
  WAREHOUSE_TRANSFERS_RESET_SELECTED_ROWS,
} from '@/store/warehouse-transfer/warehouse-transfer.type';

interface WarehouseTransferState {
  tableState: Partial<TableQuery>;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
  viewSlug: null,
};

const initialState: WarehouseTransferState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:warehouse_transfers';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('WAREHOUSE_TRANSFERS', defaultTableQuery),

  [WAREHOUSE_TRANSFERS_SET_SELECTED_ROWS]: (
    state: WarehouseTransferState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [WAREHOUSE_TRANSFERS_RESET_SELECTED_ROWS]: (
    state: WarehouseTransferState,
  ) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const warehouseTransfersPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
