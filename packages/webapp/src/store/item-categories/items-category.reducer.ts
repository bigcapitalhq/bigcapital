import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTableStateReducers } from '@/store/table-state.reducer';
import { RESET } from '@/store/types';
import type { TableQuery } from '@/store/store.types';

interface ItemCategoriesState {
  tableState: TableQuery;
}

export const defaultTableQuery: TableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
};

const initialState: ItemCategoriesState = {
  tableState: defaultTableQuery,
};

const STORAGE_KEY = 'bigcapital:itemCategories';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS_CATEGORIES', defaultTableQuery),

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const itemsCategoriesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
