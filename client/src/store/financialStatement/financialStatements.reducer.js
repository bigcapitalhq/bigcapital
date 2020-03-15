import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  balanceSheet: [],
  generalLedger: [],
  trialBalance: [],
};

export default createReducer(initialState, {
  [t.BALANCE_SHEET_STATEMENT_SET]: (state, action) => {
    state.balanceSheet.push(action.data);
  },
});