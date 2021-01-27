import { createReducer } from '@reduxjs/toolkit';
import {
  journalNumberChangedReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  currentViewId: -1,
  selectedRows: [],
};

const defaultEstimate = {
  entries: [],
};

export default createReducer(initialState, {
  [t.ESTIMATE_SET]: (state, action) => {
    const { id, estimate } = action.payload;
    const _estimate = state.items[id] || {};

    state.items[id] = { ...defaultEstimate, ..._estimate, ...estimate };
  },

  [t.ESTIMATES_ITEMS_SET]: (state, action) => {
    const { sales_estimates } = action.payload;
    const _estimates = {};
    sales_estimates.forEach((estimate) => {
      _estimates[estimate.id] = {
        ...defaultEstimate,
        ...estimate,
      };
    });
    state.items = {
      ...state.items,
      ..._estimates,
    };
  },

  [t.ESTIMATES_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.ESTIMATES_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.ESTIMATE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.ESTIMATES_PAGE_SET]: (state, action) => {
    // @todo camelCase keys.
    const { customViewId, sales_estimates, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: sales_estimates.map((i) => i.id),
        },
      },
    };
  },

  [t.ESTIMATES_PAGINATION_SET]: (state, action) => {
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
  [t.ESTIMATES_SELECTED_ROWS_SET]: (state, action) => {
    const { selectedRows } = action.payload;
    state.selectedRows = selectedRows;
  },

  ...journalNumberChangedReducer(t.ESTIMATE_NUMBER_CHANGED),
  ...createTableQueryReducers('ESTIMATES'),
});

export const getEstimateById = (state, id) => {
  return state.sales_estimates.items[id];
};
