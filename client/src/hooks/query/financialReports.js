import { useRequestQuery } from '../useQueryRequest';
import {
  trialBalanceSheetReducer,
  balanceSheetRowsReducer,
  profitLossSheetReducer,
  generalLedgerTableRowsReducer,
  journalTableRowsReducer,
  ARAgingSummaryTableRowsMapper,
  APAgingSummaryTableRowsMapper,
  inventoryValuationReducer,
  purchasesByItemsReducer,
  salesByItemsReducer,
} from 'containers/FinancialStatements/reducers';
import t from './types';

/**
 * Retrieve balance sheet.
 */
export function useBalanceSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.BALANCE_SHEET, query],
    {
      method: 'get',
      url: '/financial_statements/balance_sheet',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: balanceSheetRowsReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        data: [],
        columns: [],
        query: {},
        tableRows: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieve trial balance sheet.
 */
export function useTrialBalanceSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.TRIAL_BALANCE_SHEET, query],
    {
      method: 'get',
      url: '/financial_statements/trial_balance_sheet',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: trialBalanceSheetReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        tableRows: [],
        data: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve profit/loss (P&L) sheet.
 */
export function useProfitLossSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PROFIT_LOSS_SHEET, query],
    {
      method: 'get',
      url: '/financial_statements/profit_loss_sheet',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: profitLossSheetReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        data: {},
        tableRows: [],
        columns: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve general ledger (GL) sheet.
 */
export function useGeneralLedgerSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.GENERAL_LEDGER, query],
    {
      method: 'get',
      url: '/financial_statements/general_ledger',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: generalLedgerTableRowsReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        tableRows: [],
        data: {},
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve journal sheet.
 */
export function useJournalSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.JOURNAL, query],
    { method: 'get', url: '/financial_statements/journal', params: query },
    {
      select: (res) => ({
        tableRows: journalTableRowsReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        data: {},
        tableRows: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve A/R aging summary report.
 */
export function useARAgingSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.AR_AGING_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/receivable_aging_summary',
      params: query,
    },
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
      defaultData: {
        data: {
          customers: [],
          total: {},
        },
        columns: [],
        tableRows: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieve A/P aging summary report.
 */
export function useAPAgingSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.AP_AGING_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/payable_aging_summary',
      params: query,
    },
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
      defaultData: {
        data: {
          vendors: [],
          total: {},
        },
        columns: [],
        tableRows: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieve inventory valuation.
 */
export function useInventoryValuation(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_VALUATION, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-valuation',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: inventoryValuationReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        tableRows: [],
        data: [],
        query: {},
      },
      ...props,
    },
  );
}
/**
 * Retrieve purchases by items.
 */
export function usePurchasesByItems(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PURCHASES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/purchases-by-items',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: purchasesByItemsReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        tableRows: [],
        data: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve sales by items.
 */
export function useSalesByItems(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/sales-by-items',
      params: query,
    },
    {
      select: (res) => ({
        tableRows: salesByItemsReducer(res.data.data),
        ...res.data,
      }),
      defaultData: {
        tableRows: [],
        data: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve customers balance summary report.
 */
export function useCustomerBalanceSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.CUSTOMERS_BALANCE_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/customer-balance-summary',
      params: query,
    },
    {
      select: (res) => ({
        columns: res.data.columns,
        query: res.data.query,
        tableRows: res.data.table.rows,
      }),
      defaultData: {
        tableRows: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve vendors balance summary report.
 */
export function useVendorsBalanceSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.VENDORS_BALANCE_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/vendor-balance-summary',
      params: query,
    },
    {
      select: (res) => ({
        columns: res.data.columns,
        query: res.data.query,
        tableRows: res.data.table.rows,
      }),
      defaultData: {
        tableRows: [],
        query: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve customers transcations report.
 */
export function useCustomersTranscationsReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.CUSTOMERS_TRANSACTIONS, query],
    {
      method: 'get',
      url: '/financial_statements/transactions-by-customers',
      params: query,
    },
    {
      select: (res) => ({
        data: res.data.table,
        tableRows: res.data.table.rows,
      }),
      defaultData: {
        tableRows: [],
        data: [],
      },
      ...props,
    },
  );
}
