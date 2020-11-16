import { createReducer } from '@reduxjs/toolkit';
import {
  createTableQueryReducers,
  viewPaginationSetReducer,
} from 'store/journalNumber.reducer';
import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  nextPaymentNumberChanged: false,
};

const defaultPaymentMade = {
  entries: [],
};

export default createReducer(initialState, {
  [t.PAYMENT_MADES_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.PAYMENT_MADES_ITEMS_SET]: (state, action) => {
    const { bill_payments } = action.payload;
    const _bill_payments = {};
    bill_payments.forEach((billPayment) => {
      _bill_payments[billPayment.id] = {
        ...defaultPaymentMade,
        ...billPayment,
      };
    });
    state.items = {
      ...state.items,
      ..._bill_payments,
    };
  },

  [t.PAYMENT_MADE_SET]: (state, action) => {
    const { id, paymentMade } = action.payload;
    const _oldPaymentMade = state.items[id] || {};

    state.items[id] = {
      ...defaultPaymentMade,
      ..._oldPaymentMade,
      ...paymentMade,
    };
  },

  [t.PAYMENT_MADE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.PAYMENT_MADES_PAGE_SET]: (state, action) => {
    const { customViewId, bill_payments, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: bill_payments.map((i) => i.id),
        },
      },
    };
  },

  [t.PAYMENT_MADES_NUMBER_CHANGED]: (state, action) => {
    const { isChanged } = action.payload;
    state.nextPaymentNumberChanged = isChanged;
  },

  ...viewPaginationSetReducer(t.PAYMENT_MADES_PAGINATION_SET),
  ...createTableQueryReducers('PAYMENT_MADES'),
});
