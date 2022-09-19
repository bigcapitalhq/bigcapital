// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from '@/store/tableState.reducer';
import t from '@/store/types';

// Initial state.
const initialState = {
  tableState: {
    filterRoles: []
  },
};

const STORAGE_KEY = 'bigcapital:itemCategories';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS_CATEGORIES'),

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export default persistReducer(
  CONFIG,
  reducerInstance,
);
