import { createSelector } from 'reselect';
import { pickItemsFromIds, getItemById } from 'store/selectors';

const accountsViewsSelector = (state) => state.accounts.views;
const accountsDataSelector = (state) => state.accounts.items;
const accountsCurrentViewSelector = (state) => state.accounts.currentViewId;
const accountIdPropSelector = (state, props) => props.accountId;

const accountsListSelector = state => state.accounts.list;


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

export const getAccountsListFactory = () => createSelector(
  accountsListSelector,
  accountsDataSelector,
  (accounts, accountsItems) => {
    return pickItemsFromIds(accountsItems, accounts);
  },
)

export const getAccountById = createSelector(
  accountsDataSelector,
  accountIdPropSelector,
  (accountsItems, accountId) => {
    return getItemById(accountsItems, accountId);
  }
);