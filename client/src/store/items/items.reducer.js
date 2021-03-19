import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
    filters: [],
  },
  selectedRows: [],
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS'),
});

const STORAGE_KEY = 'bigcapital:items';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);