import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const expensesTableQuery = (state) => state.expenses.tableQuery;

const getPageExpensesQuery = (state, props) => {
  const currentPageId = state.expenses.views?.[props.viewId]?.paginationMeta?.page;
  return currentPageId || 0;
};

const getExpensesCurrentViewIdSelector = (state) => state.expenses.currentViewId;

const expensesPageSelector = (state, props, query) => {
  const viewId = state.expenses.currentViewId;
  const currentPageId = getPageExpensesQuery(state, { viewId });

  return state.expenses.views?.[viewId]?.pages?.[currentPageId];
};

const expensesItemsSelector = (state) => state.expenses.items;
const expenseByIdSelector = (state, props) => state.expenses.items[props.expenseId];

const manualJournalsPaginationSelector = (state, props) => {
  const viewId = state.expenses.currentViewId;
  return state.expenses.views?.[viewId];
};

// Retrive expenses table query.
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

// Retrieve expenses results of the current page.
export const getExpensesCurrentPageFactory = () => createSelector(
  expensesPageSelector,
  expensesItemsSelector,
  (expensesPage, expensesItems) => {
    return typeof expensesPage === 'object'
      ? pickItemsFromIds(expensesItems, expensesPage.ids) || []
      : [];
  },
);

// Retrieve specific expense by the passed expense id.
export const getExpenseByIdFactory = () => createSelector(
  expenseByIdSelector,
  (expense) => {
    return expense;
  }  
);

// Retrieve expenses pagination meta.
export const getExpensesPaginationMetaFactory = () => createSelector(
  manualJournalsPaginationSelector,
  (expensesPage) => {
    return expensesPage?.paginationMeta || {};
  },
);

// Retrieve expenses current view id.
export const getExpensesCurrentViewIdFactory = () => createSelector(
  getExpensesCurrentViewIdSelector,
  (currentViewId) => {
    return currentViewId;
  },
);