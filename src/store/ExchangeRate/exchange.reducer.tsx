// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { createTableStateReducers } from '@/store/tableState.reducer';

const initialState = {
  tableState: {
    pageSize: 20,
    pageIndex: 0,
  },
};

export default createReducer(initialState, {
  ...createTableStateReducers('EXCHANGE_RATES'),
});
