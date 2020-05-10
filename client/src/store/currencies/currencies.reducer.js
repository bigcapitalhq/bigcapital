import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  data: {},
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
});
