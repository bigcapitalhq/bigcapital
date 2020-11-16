import { createReducer } from '@reduxjs/toolkit';
import {
  viewPaginationSetReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  // 
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  currentViewId: -1,
};

const defaultExpense = {
  categories: [],
};

export default createReducer(initialState, {
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
    const { customViewId, expenses, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: expenses.map((i) => i.id),
        },
      },
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

  ...viewPaginationSetReducer(t.EXPENSES_PAGINATION_SET),
  ...createTableQueryReducers('EXPENSES'),
});

export const getExpenseById = (state, id) => {
  return state.expenses.items[id];
};
