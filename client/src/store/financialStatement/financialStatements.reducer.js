import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import {
  mapBalanceSheetToTableRows,
  journalToTableRowsMapper,
  generalLedgerToTableRows,
  profitLossToTableRowsMapper,
  ARAgingSummaryTableRowsMapper,
  APAgingSummaryTableRowsMapper,
  mapTrialBalanceSheetToRows,
} from './financialStatements.mappers';

const initialState = {
  balanceSheet: {
    sheet: {},
    loading: true,
    filter: true,
    refresh: false,
  },
  trialBalance: {
    sheet: {},
    loading: true,
    filter: true,
    refresh: false,
  },
  generalLedger: {
    sheet: {},
    loading: false,
    filter: true,
    refresh: false,
  },
  journal: {
    sheet: {},
    loading: false,
    tableRows: [],
    filter: true,
    refresh: true,
  },
  profitLoss: {
    sheet: {},
    loading: true,
    tableRows: [],
    filter: true,
  },
  receivableAgingSummary: {
    sheet: {},
    loading: false,
    tableRows: [],
    filter: true,
    refresh: false,
  },
  payableAgingSummary: {
    sheet: {},
    loading: false,
    tableRows: [],
    filter: true,
    refresh: false,
  },
};

const financialStatementFilterToggle = (financialName, statePath) => {
  return {
    [`${financialName}_FILTER_TOGGLE`]: (state, action) => {
      state[statePath].filter = !state[statePath].filter;
    },
  };
};

export default createReducer(initialState, {
  [t.BALANCE_SHEET_STATEMENT_SET]: (state, action) => {
    const balanceSheet = {
      sheet: action.data.data,
      columns: action.data.columns,
      query: action.data.query,
      tableRows: mapBalanceSheetToTableRows(action.data.data),
    };
    state.balanceSheet.sheet = balanceSheet;
  },

  [t.BALANCE_SHEET_LOADING]: (state, action) => {
    state.balanceSheet.loading = !!action.loading;
  },

  [t.BALANCE_SHEET_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.balanceSheet.refresh = refresh;
  },

  ...financialStatementFilterToggle('BALANCE_SHEET', 'balanceSheet'),

  [t.TRAIL_BALANCE_STATEMENT_SET]: (state, action) => {
    const trailBalanceSheet = {
      sheet: action.data.data,
      tableRows: mapTrialBalanceSheetToRows(action.data.data),
      query: action.data.query,
    };
    state.trialBalance.sheet = trailBalanceSheet;
  },

  [t.TRIAL_BALANCE_SHEET_LOADING]: (state, action) => {
    state.trialBalance.loading = !!action.loading;
  },

  [t.TRIAL_BALANCE_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.trialBalance.refresh = refresh;
  },

  ...financialStatementFilterToggle('TRIAL_BALANCE', 'trialBalance'),

  [t.JOURNAL_SHEET_SET]: (state, action) => {
    const journal = {
      query: action.data.query,
      data: action.data.data,
      tableRows: journalToTableRowsMapper(action.data.data),
    };
    state.journal.sheet = journal;
  },

  [t.JOURNAL_SHEET_LOADING]: (state, action) => {
    state.journal.loading = !!action.loading;
  },
  [t.JOURNAL_SHEET_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.journal.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('JOURNAL', 'journal'),

  [t.GENERAL_LEDGER_STATEMENT_SET]: (state, action) => {
    const generalLedger = {
      query: action.data.query,
      accounts: action.data.data,
      tableRows: generalLedgerToTableRows(action.data.data),
    };
    state.generalLedger.sheet = generalLedger;
  },

  [t.GENERAL_LEDGER_SHEET_LOADING]: (state, action) => {
    state.generalLedger.loading = !!action.loading;
  },
  [t.GENERAL_LEDGER_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.generalLedger.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('GENERAL_LEDGER', 'generalLedger'),

  [t.PROFIT_LOSS_SHEET_SET]: (state, action) => {
    const profitLossSheet = {
      query: action.query,
      profitLoss: action.profitLoss,
      columns: action.columns,
      tableRows: profitLossToTableRowsMapper(action.profitLoss),
    };
    state.profitLoss.sheet = profitLossSheet;
  },

  [t.PROFIT_LOSS_SHEET_LOADING]: (state, action) => {
    state.profitLoss.loading = !!action.loading;
  },

  [t.PROFIT_LOSS_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.profitLoss.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('PROFIT_LOSS', 'profitLoss'),

  [t.RECEIVABLE_AGING_SUMMARY_SET]: (state, action) => {
    const { customers, total, columns, query } = action.payload;

    const receivableSheet = {
      query,
      columns,
      customers,
      total,
      tableRows: ARAgingSummaryTableRowsMapper({ customers, columns, total }),
    };
    state.receivableAgingSummary.sheet = receivableSheet;
  },
  [t.RECEIVABLE_AGING_SUMMARY_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.receivableAgingSummary.refresh = !!refresh;
  },
  [t.RECEIVABLE_AGING_SUMMARY_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.receivableAgingSummary.loading = loading;
  },
  ...financialStatementFilterToggle(
    'RECEIVABLE_AGING_SUMMARY',
    'receivableAgingSummary',
  ),

  [t.PAYABLE_AGING_SUMMARY_SET]: (state, action) => {
    const { vendors, total, columns, query } = action.payload;

    const receivableSheet = {
      query,
      columns,
      vendors,
      total,
      // tableRows: APAgingSummaryTableRowsMapper({ vendors, columns, total }),
    };
    state.payableAgingSummary.sheet = receivableSheet;
  },
  [t.PAYABLE_AGING_SUMMARY_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.payableAgingSummary.refresh = !!refresh;
  },
  [t.PAYABLE_AGING_SUMMARY_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.payableAgingSummary.loading = loading;
  },
  ...financialStatementFilterToggle(
    'PAYABLE_AGING_SUMMARY',
    'payableAgingSummary',
  ),
});
