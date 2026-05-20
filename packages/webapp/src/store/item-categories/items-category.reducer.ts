import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createTableStateReducers,
} from '@/store/table-state.reducer';
import { RESET } from '@/store/types';;

interface ItemCategoriesState {
  tableState: { filterRoles: Array<unknown> };
}

// Initial state.
const initialState: ItemCategoriesState = {
  tableState: {
    filterRoles: [],
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

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const itemsCategoriesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
