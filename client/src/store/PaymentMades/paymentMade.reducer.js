import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';
import { omit } from 'lodash';
import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 5,
    page: 1,
  },
};

const defaultPaymentMade = {
  entries: [],
};

const reducer = createReducer(initialState, {
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

  [t.PAYMENT_MADE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.PAYMENT_MADES_PAGINATION_SET]: (state, action) => {
    const { pagination, customViewId } = action.payload;

    const mapped = {
      pageSize: parseInt(pagination.pageSize, 10),
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
});
export default createTableQueryReducers('bill_payments', reducer);
