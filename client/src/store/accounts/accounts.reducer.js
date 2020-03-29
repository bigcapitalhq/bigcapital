import t from 'store/types';
import { createReducer, combineReducers } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

const initialState = {
  items: {},
  views: {},
  accountsTypes: [],
  accountsById: {},
  accountFormErrors: [],
  datatableQuery: {},
  currentViewId: -1,
  selectedRows: [],
  loading: false,
};

const accountsReducer = createReducer(initialState, {
  [t.ACCOUNTS_ITEMS_SET]: (state, action) => {
    const _items = {};

    action.accounts.forEach((account) => {
      _items[account.id] = account;
    });
    state.items = {
      ...state.items,
      ..._items,
    };
  },

  [t.ACCOUNTS_PAGE_SET]: (state, action) => {
    const viewId = action.customViewId || -1;
    const view = state.views[viewId] || {};
  
    state.views[viewId] = {
      ...view,
      ids: action.accounts.map(i => i.id),
    };  
    state.accounts = action.accounts;
  },

  [t.ACCOUNT_TYPES_LIST_SET]: (state, action) => {
    state.accountsTypes = action.account_types;
  },

  [t.ACCOUNT_SET]: (state, action) => {
    state.accountsById[action.account.id] = action.account;
  },

  [t.ACCOUNT_DELETE]: (state, action) => {
    if (typeof state.items[action.id] !== 'undefined'){
      delete state.items[action.id];
    }
  },

  [t.ACCOUNTS_SELECTED_ROWS_SET]: (state, action) => {
    state.selectedRows.push(...action.ids);
  },

  [t.ACCOUNTS_SET_CURRENT_VIEW]: (state, action) => {  
    state.currentViewId = action.currentViewId;
  },

  [t.ACCOUNTS_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },
});

export default createTableQueryReducers('accounts', accountsReducer);

export const getAccountById = (state, id) => {
  return state.accounts.accountsById[id];
};
 
// export default {
//   // ...accountsReducer,
//   // testReducer,
// }