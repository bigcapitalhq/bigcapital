import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from 'store/tableState.reducer';
import t from 'store/types';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
  },
};

const STORAGE_KEY = 'bigcapital:bills';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: ['tableState'],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('BILLS'),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  }
});

export default persistReducer(
  CONFIG,
  reducerInstance,
);