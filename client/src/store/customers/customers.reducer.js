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
  [t.CUSTOMER_SET]: (state, action) => {
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
});

export default createTableQueryReducers('customers', customersReducer);

export const getCustomerById = (state, id) => {
  return state.customers[id];
};
