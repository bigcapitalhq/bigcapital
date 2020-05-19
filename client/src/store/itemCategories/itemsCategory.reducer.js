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
    const { id } = action.payload;

    if (typeof state.categories[id] !== 'undefined') {
      delete state.categories[id];
    }
  },

  [t.ITEM_CATEGORIES_TABLE_LOADING]: (state, action ) => {
    const { loading } = action.payload;
    state.loading = !!loading;
  },
  [t.ITEM_CATEGORIES_BULK_DELETE]:(state,action)=>{
    const {ids} =action.payload;
    const {categories} = {...state.categories};
    ids.forEach((id)=>{

      if(typeof categories[id] !=='undefined'){
        delete categories[id]
      }
    });
    state.categories =categories
  }
});

export const getCategoryId = (state, id) => {
  return state.itemCategories.categories[id] || {};
};
