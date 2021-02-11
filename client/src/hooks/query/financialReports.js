import { useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import {
  trialBalanceSheetReducer,
  balanceSheetRowsReducer,
  profitLossSheetReducer,
  generalLedgerTableRowsReducer,
  journalTableRowsReducer,
} from 'containers/FinancialStatements/reducers';
 
/**
 * Retrieve balance sheet.
 */
export function useBalanceSheet(query, props) {
  const states = useQuery(
    ['FINANCIAL-REPORT', 'BALANCE-SHEET', query],
    () =>
      ApiService.get('/financial_statements/balance_sheet', {
        params: query,
      }),
    {
      select: (res) => ({
        tableRows: balanceSheetRowsReducer(res.data.data),
        ...res.data,
      }),
      ...props
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      data: [],
      columns: [],
      query: {},
      tableRows: [],
    }),
  };
}

/**
 * Retrieve trial balance sheet.
 */
export function useTrialBalanceSheet(query, props) {
  const states = useQuery(
    ['FINANCIAL-REPORT', 'TRIAL-BALANCE-SHEET', query],
    () =>
      ApiService.get('/financial_statements/trial_balance_sheet', {
        params: query,
      }),
    {
      select: (res) => ({
        tableRows: trialBalanceSheetReducer(res.data.data),
        ...res.data,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      tableRows: [],
      data: [],
      query: {},
    })
  }
}

/**
 * Retrieve profit/loss (P&L) sheet.
 */
export function useProfitLossSheet(query, props) {
  const states = useQuery(
    ['FINANCIAL-REPORT', 'PROFIT-LOSS-SHEET', query],
    () =>
      ApiService.get('/financial_statements/profit_loss_sheet', {
        params: query,
      }),
    {
      select: (res) => ({
        tableRows: profitLossSheetReducer(res.data.data),
        ...res.data,
      }),
      ...props,
    },
  );
  return {
    ...states,
    data: defaultTo(states.data, {
      data: {},
      tableRows: [],
      columns: [],
      query: {},
    }),
  }
}

/**
 * Retrieve general ledger (GL) sheet.
 */
export function useGeneralLedgerSheet(query, props) {
  const states = useQuery(
    ['FINANCIAL-REPORT', 'GENERAL-LEDGER', query],
    () =>
      ApiService.get('/financial_statements/general_ledger', {
        params: query,
      }),
    {
      select: (res) => ({
        tableRows: generalLedgerTableRowsReducer(res.data.data),
        ...res.data,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      tableRows: [],
      data: {},
      query: {},
    }),
  }
}

/**
 * Retrieve journal sheet.
 */
export function useJournalSheet(query, props) {
  const states = useQuery(
    ['FINANCIAL-REPORT', 'JOURNAL', query],
    () =>
      ApiService.get('/financial_statements/journal', { params: query }),
    {
      select: (res) => ({
        tableRows: journalTableRowsReducer(res.data.data),
       ...res.data,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      data: {},
      tableRows: [],
      query: {},
    })
  }
}

/**
 * Retrieve AR aging summary report.
 */
export function useARAgingSummaryReport(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'AR-AGING-SUMMARY', query],
    () =>
      ApiService.get('/financial_statements/receivable_aging_summary', {
        params: query,
      }),
    props,
  );
}
