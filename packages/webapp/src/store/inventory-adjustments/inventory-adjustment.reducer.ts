import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;

interface InventoryAdjustmentsState {
  tableState: { pageSize: number; pageIndex: number; sortBy: Array<unknown> };
  selectedRows: Array<unknown>;
}

const initialState: InventoryAdjustmentsState = {
  tableState: {
    pageSize: 20,
    pageIndex: 0,
    sortBy: [],
  },
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:inventoryAdjustments';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: ['tableState'],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('INVENTORY_ADJUSTMENTS'),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const inventoryAdjustmentsPersistReducer = persistReducer(CONFIG, reducerInstance);
