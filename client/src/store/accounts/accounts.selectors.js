import { createSelector } from 'reselect';
import { pickItemsFromIds } from 'store/selectors';

const accountsViewsSelector = (state) => state.accounts.views;
const accountsDataSelector = (state) => state.accounts.items;
const accountsCurrentViewSelector = (state) => state.accounts.currentViewId;

export const getAccountsItems = createSelector(
  accountsViewsSelector,
  accountsDataSelector,
  accountsCurrentViewSelector,
  (accountsViews, accountsItems, viewId) => {
    const accountsView = accountsViews[viewId || -1];

    return typeof accountsView === 'object'
      ? pickItemsFromIds(accountsItems, accountsView.ids) || []
      : [];
  },
);
