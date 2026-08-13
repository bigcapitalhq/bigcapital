import { createReducer } from '@reduxjs/toolkit';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { TableQuery } from '@/store/store.types';
import { createTableStateReducers } from '@/store/table-state.reducer';
import {
  RESET,
  ITEMS_CATEGORIES_SET_SELECTED_ROWS,
  ITEMS_CATEGORIES_RESET_SELECTED_ROWS,
} from '@/store/types';

interface ItemCategoriesState {
  tableState: TableQuery;
  selectedRows: Array<unknown>;
}

export const defaultTableQuery: TableQuery = {
  pageSize: 20,
  pageIndex: 0,
  filterRoles: [],
};

const initialState: ItemCategoriesState = {
  tableState: defaultTableQuery,
  selectedRows: [],
};

const STORAGE_KEY = 'bigcapital:itemCategories';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  ...createTableStateReducers('ITEMS_CATEGORIES', defaultTableQuery),

  [ITEMS_CATEGORIES_SET_SELECTED_ROWS]: (
    state: ItemCategoriesState,
    action: { payload: Array<unknown> },
  ) => {
    state.selectedRows = action.payload;
  },

  [ITEMS_CATEGORIES_RESET_SELECTED_ROWS]: (state: ItemCategoriesState) => {
    state.selectedRows = [];
  },

  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
});

export const itemsCategoriesPersistReducer = persistReducer(
  CONFIG,
  reducerInstance,
);
