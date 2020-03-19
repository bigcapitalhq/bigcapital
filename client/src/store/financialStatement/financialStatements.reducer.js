import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import {getBalanceSheetIndexByQuery, getTrialBalanceSheetIndex} from './financialStatements.selectors';
import { actionComplete } from '@syncfusion/ej2-react-grids';

const initialState = {
  balanceSheets: [],
  trialBalanceSheets: [],
  generalLedger: [],
};

export default createReducer(initialState, {
  [t.BALANCE_SHEET_STATEMENT_SET]: (state, action) => {
    const index  = getBalanceSheetIndexByQuery(state.balanceSheets, action.query);

    const balanceSheet = {
      balances: action.data.balance_sheet,
      columns: Object.values(action.data.columns),
      query: action.data.query,
    };
    if (index !== -1) {
      state.balanceSheets[index] = balanceSheet;
    } else {
      state.balanceSheets.push(balanceSheet);
    }
  },

  [t.TRAIL_BALANCE_STATEMENT_SET]: (state, action) => {
    const index = getTrialBalanceSheetIndex(state.trialBalanceSheets, action.query);

    const trailBalanceSheet = {
      accounts: action.data.accounts,
      query: action.data.query,
    };
    if (index !== -1) {
      state.trialBalanceSheets[index] = trailBalanceSheet;
    } else {
      state.trailBalanceSheet.push(trailBalanceSheet);
    }
  }
});