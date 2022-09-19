// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import t from '@/store/types';

const initialState = {
  data: {},
  loading: false,
};

export default createReducer(initialState, {
  [t.CURRENCIES_REGISTERED_SET]: (state, action) => {
    const _currencies = {};

    action.currencies.forEach((currency) => {
      _currencies[currency.currency_code] = currency;
    });
    state.data = {
      ...state.data,
      ..._currencies,
    };
  },
  [t.CURRENCIES_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },
  [t.CURRENCY_CODE_DELETE]: (state, action) => {
    if (typeof state.data[action.currency_code] !== 'undefined') {
      delete state.data[action.currency_code];
    }
  },
});
