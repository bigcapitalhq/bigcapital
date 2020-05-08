import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  categories: {},
  loading: false,
};

export default createReducer(initialState, {
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

  [t.ITEM_CATEGORIES_TABLE_SET]: (state, action) => {

  },

  [t.CATEGORY_DELETE]: (state, action) => {
    if (typeof state.categories[action.id] !== 'undefined') {
      delete state.categories[action.id];
    }
  },

  [t.ITEM_CATEGORIES_TABLE_LOADING]: (state, action ) => {
    const { loading } = action.payload;
    state.loading = !!loading;
  },
});

export const getCategoryId = (state, id) => {
  return state.itemCategories.categories[id] || {};
};
