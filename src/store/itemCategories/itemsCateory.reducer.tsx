// @ts-nocheck
import t from '@/store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  tableState: {
    filterRoles: [],
  },
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
