import { createReducer } from '@reduxjs/toolkit';
import { CURRENCIES_REGISTERED_SET, CURRENCIES_TABLE_LOADING, CURRENCY_CODE_DELETE } from '@/store/types';;
import type { CurrenciesState, CurrencyAction } from './currencies.types';

const initialState: CurrenciesState = {
  data: {},
  loading: false,
};

export const currenciesReducer = createReducer(initialState, {
  [CURRENCIES_REGISTERED_SET]: (state, action: CurrencyAction) => {
    const _currencies: Record<string, unknown> = {};

    (action.currencies ?? []).forEach((currency) => {
      const code = (currency as Record<string, unknown>).currency_code as string;
      _currencies[code] = currency;
    });
    state.data = {
      ...state.data,
      ..._currencies,
    };
  },
  [CURRENCIES_TABLE_LOADING]: (state, action: CurrencyAction) => {
    state.loading = action.loading ?? false;
  },
  [CURRENCY_CODE_DELETE]: (state, action: CurrencyAction) => {
    if (action.currency_code !== undefined && typeof state.data[action.currency_code] !== 'undefined') {
      delete state.data[action.currency_code];
    }
  },
});
