import { createSelector } from 'reselect';
import { repeat } from 'lodash';
import {
  pickItemsFromIds,
  getItemById,
  paginationLocationQuery,
} from 'store/selectors';
import { flatToNestedArray, treeToList } from 'utils';

const accountsViewsSelector = (state) => state.accounts.views;
const accountsDataSelector = (state) => state.accounts.items;
const accountsCurrentViewSelector = (state) => state.accounts.currentViewId;
const accountIdPropSelector = (state, props) => props.accountId;
const accountsListSelector = (state) => state.accounts.listTree;
const accountsTableQuery = (state, props) => state.accounts.tableQuery;

export const getAccountsTableQuery = createSelector(
  accountsTableQuery,
  (tableQuery) => {
    return {
      ...tableQuery,
    };
  },
);

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
    (accountsTree, accountsItems) => {
      return treeToList(accountsTree, {
        idFieldKey: 'id',
        childrenFieldKey: 'children',
        nodeFilter: (node, depth) => accountsItems[node.id],
        nodeMapper: (node, depth) => {
          const account = accountsItems[node.id];
          const spaceChar = String.fromCharCode(160);

          return {
            ...account,
            htmlName:
              depth > 1
                ? `${repeat(spaceChar, (depth - 1) * 2)}${account.name}`
                : account.name,
            depth,
          };
        },
      });
    },
  );

export const getAccountById = createSelector(
  accountsDataSelector,
  accountIdPropSelector,
  (accountsItems, accountId) => {
    return getItemById(accountsItems, accountId);
  },
);
