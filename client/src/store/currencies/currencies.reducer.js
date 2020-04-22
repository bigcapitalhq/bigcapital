import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  preferences: {
    currencies: [],
  },
};

export default createReducer(initialState, {
  [t.CURRENCIES_REGISTERED_SET]: (state, action) => {
    const _currencies = {};

    action.currencies.forEach((currency) => {
      _currencies[currency.currency_code] = currency;
    });
    state.preferences.currencies = {
      ...state.preferences.currencies,
      ..._currencies,
    };
  },
});
