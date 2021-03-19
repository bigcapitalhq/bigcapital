import { createReducer} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';

const initialState = {
  tableState: {},
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ACCOUNTS'),
});

const STORAGE_KEY = 'bigcapital:accounts';

export default persistReducer(
  {
    key: STORAGE_KEY,
    whitelist: ['tableState'],
    storage,
  },
  reducerInstance,
);
