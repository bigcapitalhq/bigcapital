import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  errors: [],
};

const customersReducer = createReducer(initialState, {
  [t.CUSTOMERS_ITEMS_SET]: (state, action) => {
    const _customers = {};

    action.customers.forEach((customer) => {
      _customers[customer.id] = customer;
    });
    state.items = {
      ...state.items,
      ..._customers,
    };
  },
  [t.CUSTOMERS_PAGE_SET]: (state, action) => {
    const viewId = action.customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      ids: action.customers.map((i) => i.id),
    };
  },
  [t.CUSTOMER_DELETE]: (state, action) => {
    if (typeof state.items[action.id] !== 'undefined') {
      delete state.items[action.id];
    }
  },
  [t.CUSTOMERS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = !!loading;
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
  [t.CUSTOMER_SET]: (state, action) => {
    const { id, customer } = action.payload;
    state.items[id] = { ...customer };
  },
});

export default createTableQueryReducers('customers', customersReducer);

export const getCustomerById = (state, id) => {
  return state.customers.items[id];
};
