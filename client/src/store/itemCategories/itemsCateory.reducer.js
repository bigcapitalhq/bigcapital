import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  categories: {},
  categoriesById: {}
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
  [t.CATEGORY_SET]: (state, action) => {
    state.categoriesById[action.category.id] = action.category;
  }
});
export const getCategoryId = (state, id) => {
  return state.categories.categoriesById[id];
};
