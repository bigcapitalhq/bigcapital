import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  tableQuery: {
    page_size: 5,
    page: 1,
  },
  currentViewId: -1,
};

const reducer = createReducer(initialState, {
  [t.VENDORS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.VENDORS_ITEMS_SET]: (state, action) => {
    const { vendors } = action.payload;
    const _vendors = {};
    vendors.forEach((vendor) => {
      _vendors[vendor.id] = {
        ...vendor,
      };
    });
    state.items = {
      ...state.items,
      ..._vendors,
    };
  },

  [t.VENDORS_PAGE_SET]: (state, action) => {
    const { customViewId, vendors, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: vendors.map((i) => i.id),
        },
      },
    };
  },

  [t.VENDOR_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.VENDORS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.VENDORS_PAGINATION_SET]: (state, action) => {
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

  // [t.VENDOR_SET]: (state, action) => {
  //   const { id, vendor } = action.payload;
  //   const _venders = state.items[id] || {};
  //   state.items[id] = { ..._venders, ...vendor };
  // },
});

export default createTableQueryReducers('vendors', reducer);
