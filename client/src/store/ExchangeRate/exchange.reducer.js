import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  exchangeRates: {},
};

export default createReducer(initialState, {
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
    state.loading = action.loading;
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
