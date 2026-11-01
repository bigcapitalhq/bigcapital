import { createReducer } from '@reduxjs/toolkit';
import {
  AP_AGING_SUMMARY,
  AR_AGING_SUMMARY,
  BALANCE_SHEET,
  CASH_FLOW_STATEMENT,
  CUSTOMERS_BALANCE_SUMMARY,
  CUSTOMERS_TRANSACTIONS,
  DISPLAY_FILTER_DRAWER_TOGGLE,
  GENERAL_LEDGER,
  INVENTORY_ITEM_DETAILS,
  INVENTORY_VALUATION,
  JOURNAL,
  PROFIT_LOSS,
  PURCHASES_BY_ITEMS,
  REALIZED_GAIN_OR_LOSS,
  SALES_BY_ITEMS,
  SALES_TAX_LIABILITY_SUMMARY,
  TRIAL_BALANCE_SHEET,
  UNREALIZED_GAIN_OR_LOSS,
  VENDORS_BALANCE_SUMMARY,
  VENDORS_TRANSACTIONS,
} from '@/store/types';

interface FinancialReportSlice {
  displayFilterDrawer: boolean;
}

export interface FinancialStatementsState {
  [key: string]: FinancialReportSlice;
}

const initialState: FinancialStatementsState = {
  balanceSheet: { displayFilterDrawer: false },
  trialBalance: { displayFilterDrawer: false },
  generalLedger: { displayFilterDrawer: false },
  journal: { displayFilterDrawer: false },
  profitLoss: { displayFilterDrawer: false },
  ARAgingSummary: { displayFilterDrawer: false },
  APAgingSummary: { displayFilterDrawer: false },
  purchasesByItems: { displayFilterDrawer: false },
  salesByItems: { displayFilterDrawer: false },
  inventoryValuation: { displayFilterDrawer: false },
  customersBalanceSummary: { displayFilterDrawer: false },
  vendorsBalanceSummary: { displayFilterDrawer: false },
  customersTransactions: { displayFilterDrawer: false },
  vendorsTransactions: { displayFilterDrawer: false },
  cashFlowStatement: { displayFilterDrawer: false },
  inventoryItemDetails: { displayFilterDrawer: false },
  realizedGainOrLoss: { displayFilterDrawer: false },
  unrealizedGainOrLoss: { displayFilterDrawer: false },
  salesTaxLiabilitySummary: { displayFilterDrawer: false },
};

type ToggleAction = { payload?: { toggle?: boolean } };

const financialStatementFilterToggle = (
  financialName: string,
  statePath: string,
) => ({
  [`${financialName}/${DISPLAY_FILTER_DRAWER_TOGGLE}`]: (
    state: FinancialStatementsState,
    action: ToggleAction,
  ) => {
    state[statePath].displayFilterDrawer =
      typeof action?.payload?.toggle !== 'undefined'
        ? action.payload!.toggle!
        : !state[statePath].displayFilterDrawer;
  },
});

export const financialStatementsReducer = createReducer(initialState, {
  ...financialStatementFilterToggle(BALANCE_SHEET, 'balanceSheet'),
  ...financialStatementFilterToggle(TRIAL_BALANCE_SHEET, 'trialBalance'),
  ...financialStatementFilterToggle(JOURNAL, 'journal'),
  ...financialStatementFilterToggle(GENERAL_LEDGER, 'generalLedger'),
  ...financialStatementFilterToggle(PROFIT_LOSS, 'profitLoss'),
  ...financialStatementFilterToggle(AR_AGING_SUMMARY, 'ARAgingSummary'),
  ...financialStatementFilterToggle(AP_AGING_SUMMARY, 'APAgingSummary'),
  ...financialStatementFilterToggle(PURCHASES_BY_ITEMS, 'purchasesByItems'),
  ...financialStatementFilterToggle(SALES_BY_ITEMS, 'salesByItems'),
  ...financialStatementFilterToggle(INVENTORY_VALUATION, 'inventoryValuation'),
  ...financialStatementFilterToggle(
    CUSTOMERS_BALANCE_SUMMARY,
    'customersBalanceSummary',
  ),
  ...financialStatementFilterToggle(
    VENDORS_BALANCE_SUMMARY,
    'vendorsBalanceSummary',
  ),
  ...financialStatementFilterToggle(
    CUSTOMERS_TRANSACTIONS,
    'customersTransactions',
  ),
  ...financialStatementFilterToggle(
    VENDORS_TRANSACTIONS,
    'vendorsTransactions',
  ),
  ...financialStatementFilterToggle(CASH_FLOW_STATEMENT, 'cashFlowStatement'),
  ...financialStatementFilterToggle(
    INVENTORY_ITEM_DETAILS,
    'inventoryItemDetails',
  ),
  ...financialStatementFilterToggle(
    REALIZED_GAIN_OR_LOSS,
    'realizedGainOrLoss',
  ),
  ...financialStatementFilterToggle(
    UNREALIZED_GAIN_OR_LOSS,
    'unrealizedGainOrLoss',
  ),
  ...financialStatementFilterToggle(
    SALES_TAX_LIABILITY_SUMMARY,
    'salesTaxLiabilitySummary',
  ),
});
