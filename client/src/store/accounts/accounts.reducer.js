import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  items: {},
  views: {},
  accountsTypes: [],
  accountsById: {},
  accountFormErrors: [],
  datatableQuery: {},
  currentViewId: -1,
  bulkActions: {},
};

export default createReducer(initialState, {
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

  [t.ACCOUNT_BULK_ACTION_ADD]: (state, action) => {
    state.bulkActions[action.account_id] = true;
  },

  [t.ACCOUNT_BULK_ACTION_REMOVE]: (state, action) => {
    delete state.bulkActions[action.account_id];
  },

  [t.ACCOUNTS_SET_CURRENT_VIEW]: (state, action) => {  
    state.currentViewId = action.currentViewId;
  }
});

export const getAccountById = (state, id) => {
  return state.accounts.accountsById[id];
};