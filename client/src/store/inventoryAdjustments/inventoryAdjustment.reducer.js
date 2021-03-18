import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
    sortBy: [],
  },
  selectedRows: [],
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('INVENTORY_ADJUSTMENTS'), 
});

const STORAGE_KEY = 'bigcapital:inventoryAdjustments';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);
