import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from 'store/tableState.reducer';
import t from 'store/types';

const initialState = {
  tableState: {
    pageSize: 12,
    pageIndex: 0,
    filterRoles: [],
  },
};

const STORAGE_KEY = 'bigcapital:estimates';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ESTIMATES'),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(
  CONFIG,
  reducerInstance,
);
