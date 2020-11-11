import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';
import { omit } from 'lodash';
import { journalNumberChangedReducer } from 'store/journalNumber.reducer';

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

const defaultPaymentReceive = {
  entries: [],
};

const reducer = createReducer(initialState, {
  [t.PAYMENT_RECEIVE_SET]: (state, action) => {
    const { id, paymentReceive } = action.payload;

    const _paymentReceive = {
      ...paymentReceive,
      entries: paymentReceive.entries.map((e) => {
        return { ...omit(e, ['invoice']) };
      }),
    };

    const oldPaymentReceive = state.items[id] || {};
    state.items[id] = {
      ...defaultPaymentReceive,
      ...oldPaymentReceive,
      ..._paymentReceive,
    };
  },

  [t.PAYMENT_RECEIVES_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.PAYMENT_RECEIVES_ITEMS_SET]: (state, action) => {
    const { payment_receives } = action.payload;
    const _payment_receives = {};
    payment_receives.forEach((payment_receive) => {
      _payment_receives[payment_receive.id] = {
        ...defaultPaymentReceive,
        ...payment_receive,
      };
    });
    state.items = {
      ...state.items,
      ..._payment_receives,
    };
  },

  [t.PAYMENT_RECEIVE_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.PAYMENT_RECEIVE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.PAYMENT_RECEIVES_PAGINATION_SET]: (state, action) => {
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

  [t.PAYMENT_RECEIVES_PAGE_SET]: (state, action) => {
    const { customViewId, payment_receives, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};
    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: payment_receives.map((i) => i.id),
        },
      },
    };
  },

  ...journalNumberChangedReducer(t.PAYMENT_RECEIVE_NUMBER_CHANGED),
});
export default createTableQueryReducers('payment_receives', reducer);
