import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
    sortBy: [],
  },
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('PAYMENT_MADES'),
});

const STORAGE_KEY = 'bigcapital:paymentMades';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);
