// @ts-nocheck
import t from '@/store/types';
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
  categories: {},
  loading: false,
};

const STORAGE_KEY = 'bigcapital:itemCategories';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  [t.ITEMS_CATEGORY_LIST_SET]: (state, action) => {
    const _categories = {};

    action.categories.forEach(category => {
      _categories[category.id] = category;
    });
    state.categories = {
      ...state.categories,
      ..._categories
    };
  },

  [t.CATEGORY_DELETE]: (state, action) => {
    const { id } = action.payload;
    const categories = { ...state.categories };

    if (typeof categories[id] !== 'undefined') {
      delete categories[id];
      state.categories = categories;
    }
  }
});

export const getCategoryId = (state, id) => {
  return state.itemCategories.categories[id] || {};
};

export default persistReducer(
  CONFIG,
  reducerInstance,
);
