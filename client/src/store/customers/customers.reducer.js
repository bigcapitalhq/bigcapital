import t from 'store/types';
import { snakeCase } from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 5,
    page: 1,
  },
  errors: [],
};

const customersReducer = createReducer(initialState, {
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
      delete state.items[action.id];
    }
  },

  [t.CUSTOMERS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.CUSTOMERS_PAGINATION_SET]: (state, action) => {
    const { pagination, customViewId } = action.payload;

    const mapped = {
      pageSize: parseInt(pagination.page_size, 10),
      page: parseInt(pagination.page, 10),
      total: parseInt(pagination.total, 10),
    };
    const paginationMeta = {
      ...mapped,
      pagesCount: Math.ceil(mapped.total / mapped.pageSize),
      pageIndex: Math.max(mapped.page - 1, 0),
    };
    state.views = {
      ...state.views,
      [customViewId]: {
        ...(state.views?.[customViewId] || {}),
        paginationMeta,
      },
    };
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
});

export default createTableQueryReducers('customers', customersReducer);

export const getCustomerById = (state, id) => {
  return state.customers.items[id];
};
