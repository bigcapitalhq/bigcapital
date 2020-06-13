import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

import t from 'store/types';
import { omit } from 'lodash';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
};

const defaultExpense = {
  categories: [],
};

const reducer = createReducer(initialState, {
  [t.EXPENSE_SET]: (state, action) => {
    const { id, expense } = action.payload;
    const oldExpense = state.items[id] || {};

    state.items[id] = { ...defaultExpense, ...oldExpense, ...expense };
  },

  [t.EXPENSE_PUBLISH]: (state, action) => {
    const { id } = action.payload;
    const item = state.items[id] || {};

    state.items[id] = { ...item, status: 1 };
  },

  [t.EXPENSES_ITEMS_SET]: (state, action) => {
    const { expenses } = action.payload;
    const _expenses = {};

    expenses.forEach((expense) => {
      _expenses[expense.id] = {
        ...defaultExpense,
        ...expense,
      };
    });
    state.items = {
      ...state.items,
      ..._expenses,
    };
  },

  [t.EXPENSES_PAGE_SET]: (state, action) => {
    const { customViewId, expenses } = action.payload;
    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      ids: expenses.map((i) => i.id),
    };
  },

  [t.EXPENSES_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.EXPENSES_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.EXPENSE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.EXPENSES_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    const items = { ...state.items };

    ids.forEach((id) => {
      if (typeof items[id] !== 'undefined') {
        delete items[id];
      }
    });
    state.items = items;
  },
});

export default createTableQueryReducers('expenses', reducer);

export const getExpenseById = (state, id) => {
  // debugger;
  // state.items = omit(state.items, [id]);
  return state.expenses.items[id];
};
