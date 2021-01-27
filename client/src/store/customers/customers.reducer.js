import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import {
  viewPaginationSetReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  selectedRows: [],
  // Responsible for data fetch query based on this query.
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  errors: [],
};

export default createReducer(initialState, {
  [t.CUSTOMER_SET]: (state, action) => {
    const { id, customer } = action.payload;
    const _customers = state.items[id] || {};
    state.items[id] = { ..._customers, ...customer };
  },

  [t.CUSTOMERS_ITEMS_SET]: (state, action) => {
    const { customers } = action.payload;

    const _customers = {};

    customers.forEach((customer) => {
      _customers[customer.id] = customer;
    });
    state.items = {
      ...state.items,
      ..._customers,
    };
  },

  [t.CUSTOMERS_PAGE_SET]: (state, action) => {
    const { customViewId, customers, paginationMeta } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [paginationMeta.page]: {
          ids: customers.map((i) => i.id),
        },
      },
    };
  },

  [t.CUSTOMER_DELETE]: (state, action) => {
    const { id } = action.payload;
    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.CUSTOMERS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.CUSTOMERS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.CUSTOMERS_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    const items = { ...state.items };

    ids.forEach((id) => {
      if (typeof items[id] !== 'undefined') {
        delete items[id];
      }
    });
    state.items = items;
  },
  [t.CUSTOMER_SELECTED_ROWS_SET]: (state, action) => {
    const { selectedRows } = action.payload;
    state.selectedRows = selectedRows;
  },
  ...viewPaginationSetReducer(t.CUSTOMERS_PAGINATION_SET),
  ...createTableQueryReducers('CUSTOMERS'),
});

export const getCustomerById = (state, id) => {
  return state.customers.items[id];
};