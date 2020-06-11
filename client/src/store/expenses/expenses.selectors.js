import { pickItemsFromIds } from 'store/selectors';

export const getExpensesItems = (state, viewId) => {
  const accountsView = state.expenses.views[viewId || -1];
  const accountsItems = state.expenses.items;

  return typeof accountsView === 'object'
    ? pickItemsFromIds(accountsItems, accountsView.ids) || []
    : [];
};
