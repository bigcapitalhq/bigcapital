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
});
