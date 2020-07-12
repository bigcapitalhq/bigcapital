import { createSelector } from 'reselect';
import { pickItemsFromIds, getItemById } from 'store/selectors';
import { flatToNestedArray } from 'utils';

const accountsViewsSelector = (state) => state.accounts.views;
const accountsDataSelector = (state) => state.accounts.items;
const accountsCurrentViewSelector = (state) => state.accounts.currentViewId;
const accountIdPropSelector = (state, props) => props.accountId;
const accountsListSelector = (state) => state.accounts.list;

export const getAccountsItems = createSelector(
  accountsViewsSelector,
  accountsDataSelector,
  accountsCurrentViewSelector,
  (accountsViews, accountsItems, viewId) => {
    const accountsView = accountsViews[viewId || -1];
    const config = { id: 'id', parentId: 'parent_account_id' };
    const accounts =
      typeof accountsView === 'object'
        ? pickItemsFromIds(accountsItems, accountsView.ids) || []
        : [];
    return flatToNestedArray(
      accounts.map((a) => ({ ...a })),
      config,
    );
  },
);

export const getAccountsListFactory = () =>
  createSelector(
    accountsListSelector,
    accountsDataSelector,
    (accounts, accountsItems) => {
      return pickItemsFromIds(accountsItems, accounts);
    },
  );

export const getAccountById = createSelector(
  accountsDataSelector,
  accountIdPropSelector,
  (accountsItems, accountId) => {
    return getItemById(accountsItems, accountId);
  },
);
