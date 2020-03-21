import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import {
  getBalanceSheetIndexByQuery,
  getTrialBalanceSheetIndex,
  getFinancialSheetIndexByQuery,
} from './financialStatements.selectors';

const initialState = {
  balanceSheets: [],
  trialBalanceSheets: [],
  generalLedger: [],
  journalSheets: [],
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
  },

  [t.JOURNAL_SHEET_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(state.journalSheets, action.query);
    console.log(index, 'INDEX');
    
    const journal = {
      query: action.data.query,
      journal: action.data.journal,
    };
    if (index !== -1) {
      state.journalSheets[index] = journal;
    } else {
      state.journalSheets.push(journal);
    }
  }
});