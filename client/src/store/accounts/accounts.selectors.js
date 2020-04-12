import { pickItemsFromIds } from 'store/selectors';

export const getAccountsItems = (state, viewId) => {
  
  const accountsView = state.accounts.views[viewId || -1];
  const accountsItems = state.accounts.items;

  return typeof accountsView === 'object'
    ? pickItemsFromIds(accountsItems, accountsView.ids) || []
    : [];
};