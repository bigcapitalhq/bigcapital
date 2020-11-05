import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';
import t from 'store/types';

const initialState = {
  exchangeRates: {},
  loading: false,
  views: {},
  tableQuery: {
    page_size: 5,
    page: 1,
  },
  currentViewId: -1,
};

const reducer = createReducer(initialState, {
  [t.EXCHANGE_RATE_LIST_SET]: (state, action) => {
    const _exchangeRates = {};
    action.exchange_rates.forEach((exchange_rate) => {
      _exchangeRates[exchange_rate.id] = exchange_rate;
    });

    state.exchangeRates = {
      ...state.exchangeRates,
      ..._exchangeRates,
    };
  },

  [t.EXCHANGE_RATE_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.EXCHANGE_RATES_PAGE_SET]: (state, action) => {
    const { customViewId, exchange_rates, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};
    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: exchange_rates.map((i) => i.id),
        },
      },
    };
  },

  [t.EXCHANGE_RATES_PAGINATION_SET]: (state, action) => {
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

  [t.EXCHANGE_RATES_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    ids.forEach((id) => {
      if (typeof state.exchangeRates[id] !== 'undefined') {
        delete state.exchangeRates[id];
      }
    });
  },
  [t.EXCHANGE_RATE_DELETE]: (state, action) => {
    if (typeof state.exchangeRates[action.id] !== 'undefined') {
      delete state.exchangeRates[action.id];
    }
  },
});

export default createTableQueryReducers('exchange_rates', reducer);
