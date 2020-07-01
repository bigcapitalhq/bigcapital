import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const expensesTableQuery = state => state.expenses.tableQuery;

export const getExpensesTableQuery = createSelector(
  paginationLocationQuery,
  expensesTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const expensesPageSelector = (state, props, query) => {
  const viewId = state.expenses.currentViewId;
  return state.expenses.views?.[viewId]?.pages?.[query.page];
};

const expensesItemsSelector = (state) => state.expenses.items;

export const getExpensesCurrentPageFactory = () => createSelector(
  expensesPageSelector,
  expensesItemsSelector,
  (expensesPage, expensesItems) => {
    return typeof expensesPage === 'object'
      ? pickItemsFromIds(expensesItems, expensesPage.ids) || []
      : [];
  },
);

const expenseByIdSelector = (state, props) => state.expenses.items[props.expenseId];

export const getExpenseByIdFactory = () => createSelector(
  expenseByIdSelector,
  (expense) => {
    return expense;
  }  
);

const manualJournalsPaginationSelector = (state, props) => {
  const viewId = state.expenses.currentViewId;
  return state.expenses.views?.[viewId];
};

export const getExpensesPaginationMetaFactory = () => createSelector(
  manualJournalsPaginationSelector,
  (expensesPage) => {
    return expensesPage?.paginationMeta || {};
  },
);