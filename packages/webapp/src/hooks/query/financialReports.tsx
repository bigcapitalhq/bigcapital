// @ts-nocheck
import { useRequestQuery } from '../useQueryRequest';
import {
  generalLedgerTableRowsReducer,
  journalTableRowsReducer,
  inventoryValuationReducer,
  purchasesByItemsReducer,
  salesByItemsReducer,
} from '@/containers/FinancialStatements/reducers';
import t from './types';
import { useDownloadFile } from '../useDownloadFile';

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useBalanceSheetXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/balance_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'balance_sheet.xlsx',
    ...args,
  });
};

export const useBalanceSheetCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/balance_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'balance_sheet.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useTrialBalanceSheetXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/trial_balance_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'trial_balance_sheet.xlsx',
    ...args,
  });
};

export const useTrialBalanceSheetCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/trial_balance_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'trial_balance_sheet.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useProfitLossSheetXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/profit_loss_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'profit_loss_sheet.xlsx',
    ...args,
  });
};

export const useProfitLossSheetCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/profit_loss_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'profit_loss_sheet.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useARAgingSheetXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/receivable_aging_summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'receivable_aging_summary.xlsx',
    ...args,
  });
};

export const useARAgingSheetCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/receivable_aging_summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'receivable_aging_summary.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useAPAgingSheetXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/payable_aging_summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'payable_aging_summary.xlsx',
    ...args,
  });
};

export const useAPAgingSheetCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/payable_aging_summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'payable_aging_summary.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => ({
        query: res.data.query,
        table: res.data.table,
      }),
      defaultData: {
        table: {},
        query: {},
      },
      ...props,
    },
  );
}

export const useCustomerBalanceSummaryXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/customer-balance-summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'customer_balance_summary.xlsx',
    ...args,
  });
};

export const useCustomerBalanceSummaryCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/customer-balance-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'customer_balance_summary.csv',
    ...args,
  });
};

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
      headers: {
        Accept: 'application/json+table',
      },
    },

    {
      select: (res) => ({
        query: res.data.query,
        table: res.data.table,
      }),
      defaultData: {
        table: {},
        query: {},
      },
      ...props,
    },
  );
}

export const useVendorBalanceSummaryXlsxExport = (args) => {
  const url = '/financial_statements/vendor-balance-summary';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
  };
  const filename = 'vendor_balance_summary.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useVendorBalanceSummaryCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/vendor-balance-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'vendor_balance_summary.csv',
    ...args,
  });
};

/**
 * Retrieve customers transactions report.
 */
export function useCustomersTransactionsReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.CUSTOMERS_TRANSACTIONS, query],
    {
      method: 'get',
      url: '/financial_statements/transactions-by-customers',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
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

export const useCustomersTransactionsXlsxExport = (args) => {
  const url = '/financial_statements/transactions-by-customers';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
  };
  const filename = 'customers_transactions.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useCustomersTransactionsCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/transactions-by-customers',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'customers_transactions.csv',
    ...args,
  });
};

/**
 * Retrieve vendors transactions report.
 */
export function useVendorsTransactionsReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.VENDORS_TRANSACTIONS, query],
    {
      method: 'get',
      url: '/financial_statements/transactions-by-vendors',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
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

export const useVendorsTransactionsXlsxExport = (args) => {
  const url = '/financial_statements/transactions-by-vendors';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
  };
  const filename = 'vendor_balance_summary.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useVendorsTransactionsCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/transactions-by-vendors',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'vendor_balance_summary.csv',
    ...args,
  });
};

/**
 * Retrieve cash flow statement report.
 */
export function useCashFlowStatementReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.CASH_FLOW_STATEMENT, query],
    {
      method: 'get',
      url: '/financial_statements/cash-flow',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => ({
        columns: res.data.table.columns,
        query: res.data.query,
        meta: res.data.meta,
        tableRows: res.data.table.data,
      }),
      defaultData: {
        tableRows: [],
        columns: [],
        query: {},
        meta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve inventory item detail report.
 */
export function useInventoryItemDetailsReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_ITEM_DETAILS, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-item-details',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => ({
        columns: res.data.table.columns,
        query: res.data.query,
        meta: res.data.meta,
        tableRows: res.data.table.data,
      }),
      defaultData: {
        tableRows: [],
        columns: [],
        query: {},
        meta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve transactions by reference report.
 */
export function useTransactionsByReference(query, props) {
  return useRequestQuery(
    [t.TRANSACTIONS_BY_REFERENCE, query],
    {
      method: 'get',
      url: `/financial_statements/transactions-by-reference`,
      params: query,
    },
    {
      select: (res) => res.data,
      defaultData: {
        transactions: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieves the sales tax liability summary report.
 */
export function useSalesTaxLiabilitySummary(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_TAX_LIABILITY_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/sales-tax-liability-summary',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useSalesTaxLiabilitySummaryXlsxExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
    },
    filename: 'vendor_balance_summary.xlsx',
    ...args,
  });
};

export const useSalesTaxLiabilitySummaryCsvExport = (args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
    },
    filename: 'vendor_balance_summary.csv',
    ...args,
  });
};
