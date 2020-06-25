import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds } from 'store/selectors';

const expensesViewsSelector = state => state.expenses.views;
const expensesItemsSelector = state => state.expenses.items;
const expensesCurrentViewSelector = state => state.expenses.currentViewId;

export const getExpensesItems = createSelector(
  expensesViewsSelector,
  expensesItemsSelector,
  expensesCurrentViewSelector,
  (expensesViews, expensesItems, currentViewId) => {
    const expensesView = expensesViews[currentViewId || -1];

    return (typeof expensesView === 'object')
      ? (pickItemsFromIds(expensesItems, expensesView.ids) || [])
      : [];
  },
);
