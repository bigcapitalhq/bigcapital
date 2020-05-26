import t from 'store/types';
import { createReducer} from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

const initialState = {
  items: {},
  views: {},
  accountsTypes: [],
  accountsById: {},
  tableQuery: {},
  currentViewId: -1,
  selectedRows: [],
  loading: false,
  errors: [],
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
    const { ids } = action.payload;
    state.selectedRows = [];
  },

  [t.ACCOUNTS_SET_CURRENT_VIEW]: (state, action) => {  
    state.currentViewId = action.currentViewId;
  },

  [t.ACCOUNTS_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },

  [t.ACCOUNT_ERRORS_SET]: (state, action) => {
    const { errors } = action.payload;
    state.errors = errors;
  },

  [t.ACCOUNT_ERRORS_CLEAR]: (state, action) => {
    state.errors = [];
  },

  [t.ACCOUNTS_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    const items = { ...state.items };

    ids.forEach((id) => {
      if (typeof items[id] !== 'undefined') {
        delete items[id];
      }
    });
    state.items = items;
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