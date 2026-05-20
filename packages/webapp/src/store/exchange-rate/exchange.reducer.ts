import { createReducer } from '@reduxjs/toolkit';
import { createTableStateReducers } from '@/store/table-state.reducer';

interface ExchangeRateState {
  tableState: { pageSize: number; pageIndex: number };
}

const initialState: ExchangeRateState = {
  tableState: {
    pageSize: 20,
    pageIndex: 0,
  },
};

export const exchangeRatesReducer = createReducer(initialState, {
  ...createTableStateReducers('EXCHANGE_RATES'),
});
