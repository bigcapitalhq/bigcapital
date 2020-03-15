import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  list: [],
  detailsById: {},
};

export default createReducer(initialState, {
  [t.EXPENSES_LIST_SET]: (state, action) => {
    state.list = action.expenses;
  },

  [t.EXPENSE_SET]: (state, action) => {
    state.detailsById[action.expense.id] = action.expense;
  },
});

export const getExpenseById = (state, id) => {
  return state.expenses.detailsById[id];
};