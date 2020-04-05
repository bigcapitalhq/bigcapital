import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  categories: {}
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
    if (typeof state.categories[action.id] !== 'undefined') {
      delete state.categories[action.id];
    }
  }
});

export const getCategoryId = (state, id) => {
  return state.itemCategories.categories[id] || {};
};
