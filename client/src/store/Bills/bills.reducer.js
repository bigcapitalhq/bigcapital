import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

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

const defaultBill = {
  entries: [],
};

const reducer = createReducer(initialState, {
  [t.BILL_SET]: (state, action) => {
    const { id, bill } = action.payload;
    const _bill = state.items[id] || {};

    state.items[id] = { ...defaultBill, ..._bill, ...bill };
  },
  [t.BILLS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.BILLS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.BILLS_ITEMS_SET]: (state, action) => {
    const { bills } = action.payload;
    const _bills = {};
    bills.forEach((bill) => {
      _bills[bill.id] = {
        ...defaultBill,
        ...bill,
      };
    });
    state.items = {
      ...state.items,
      ..._bills,
    };
  },

  [t.BILL_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.BILLS_PAGE_SET]: (state, action) => {
    const { customViewId, bills, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: bills.map((i) => i.id),
        },
      },
    };
  },

  [t.BILLS_PAGINATION_SET]: (state, action) => {
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

});

export default createTableQueryReducers('bills', reducer);

