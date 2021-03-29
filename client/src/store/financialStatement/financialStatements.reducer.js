import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

// Initial state.
const initialState = {
  balanceSheet: {
    displayFilterDrawer: false,
  },
  trialBalance: {
    displayFilterDrawer: false,
  },
  generalLedger: {
    displayFilterDrawer: false,
  },
  journal: {
    displayFilterDrawer: false,
  },
  profitLoss: {
    displayFilterDrawer: false,
  },
  ARAgingSummary: {
    displayFilterDrawer: false,
  },
  APAgingSummary: {
    displayFilterDrawer: false,
  },
  purchasesByItems: {
    displayFilterDrawer: false,
  },
  salesByItems: {
    displayFilterDrawer: false,
  },
  inventoryValuation: {
    displayFilterDrawer: false,
  },
};

/**
 * Financial statement filter toggle.
 */
const financialStatementFilterToggle = (financialName, statePath) => {
  return {
    [`${financialName}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`]: (state, action) => {
      state[statePath].displayFilterDrawer =
        typeof action?.payload?.toggle !== 'undefined'
          ? action.payload.toggle
          : !state[statePath].displayFilterDrawer;
    },
  };
};

export default createReducer(initialState, {
  ...financialStatementFilterToggle(t.BALANCE_SHEET, 'balanceSheet'),
  ...financialStatementFilterToggle(t.TRIAL_BALANCE_SHEET, 'trialBalance'),
  ...financialStatementFilterToggle(t.JOURNAL, 'journal'),
  ...financialStatementFilterToggle(t.GENERAL_LEDGER, 'generalLedger'),
  ...financialStatementFilterToggle(t.PROFIT_LOSS, 'profitLoss'),
  ...financialStatementFilterToggle(t.AR_AGING_SUMMARY, 'ARAgingSummary'),
  ...financialStatementFilterToggle(t.AP_AGING_SUMMARY, 'APAgingSummary'),
  ...financialStatementFilterToggle(t.PURCHASES_BY_ITEMS, 'purchasesByItems'),
  ...financialStatementFilterToggle(t.SALES_BY_ITEMS, 'salesByItems'),
  ...financialStatementFilterToggle(
    t.INVENTORY_VALUATION,
    'inventoryValuation',
  ),
});
