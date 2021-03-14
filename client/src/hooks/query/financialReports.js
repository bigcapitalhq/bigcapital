import { useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import {
  trialBalanceSheetReducer,
  balanceSheetRowsReducer,
  profitLossSheetReducer,
  generalLedgerTableRowsReducer,
  journalTableRowsReducer,
  ARAgingSummaryTableRowsMapper,
  APAgingSummaryTableRowsMapper
} from 'containers/FinancialStatements/reducers';
import useApiRequest from '../useRequest';
import t from './types';

/**
 * Retrieve balance sheet.
 */
export function useBalanceSheet(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.FINANCIAL_REPORT, t.BALANCE_SHEET, query],
    () =>
      apiRequest.get('/financial_statements/balance_sheet', {
        params: query,
      }),
    {
      select: (res) => ({
        tableRows: balanceSheetRowsReducer(res.data.data),
        ...res.data,
      }),
      ...props,
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
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.FINANCIAL_REPORT, t.TRIAL_BALANCE_SHEET, query],
    () =>
      apiRequest.get('/financial_statements/trial_balance_sheet', {
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
    }),
  };
}

/**
 * Retrieve profit/loss (P&L) sheet.
 */
export function useProfitLossSheet(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.FINANCIAL_REPORT, t.PROFIT_LOSS_SHEET, query],
    () =>
      apiRequest.get('/financial_statements/profit_loss_sheet', {
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
  };
}

/**
 * Retrieve general ledger (GL) sheet.
 */
export function useGeneralLedgerSheet(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.FINANCIAL_REPORT, t.GENERAL_LEDGER, query],
    () =>
      apiRequest.get('/financial_statements/general_ledger', {
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
  };
}

/**
 * Retrieve journal sheet.
 */
export function useJournalSheet(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    [t.FINANCIAL_REPORT, t.JOURNAL, query],
    () => apiRequest.get('/financial_statements/journal', { params: query }),
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
    }),
  };
}

/**
 * Retrieve A/R aging summary report.
 */
export function useARAgingSummaryReport(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.FINANCIAL_REPORT, t.AR_AGING_SUMMARY, query],
    () =>
      apiRequest.get('/financial_statements/receivable_aging_summary', {
        params: query,
      }),
    {
      select: (res) => ({
        columns: res.data.columns,
        data: res.data.data,
        query: res.data.query,
        tableRows: ARAgingSummaryTableRowsMapper({
          customers: res.data.data.customers,
          total: res.data.data.total,
          columns: res.data.columns,
        }),
      }),
      initialData: {
        data: {
          data: {
            customers: [],
            total: {},
          },
          columns: [],
          tableRows: [],
        },
      },
      initialDataUpdatedAt: 0,
      ...props,
    },
  );
}

/**
 * Retrieve A/P aging summary report.
 */
export function useAPAgingSummaryReport(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.FINANCIAL_REPORT, t.AP_AGING_SUMMARY, query],
    () =>
      apiRequest.get('/financial_statements/payable_aging_summary', {
        params: query,
      }),
    {
      select: (res) => ({
        columns: res.data.columns,
        data: res.data.data,
        query: res.data.query,
        tableRows: APAgingSummaryTableRowsMapper({
          vendors: res.data.data.vendors,
          total: res.data.data.total,
          columns: res.data.columns,
        }),
      }),
      initialData: {
        data: {
          data: {
            vendors: [],
            total: {},
          },
          columns: [],
          tableRows: [],
        },
      },
      initialDataUpdatedAt: 0,
      ...props,
    },
  );
}
