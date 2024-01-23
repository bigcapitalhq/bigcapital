// @ts-nocheck
import { useRequestQuery } from '../useQueryRequest';
import { purchasesByItemsReducer } from '@/containers/FinancialStatements/reducers';
import { useDownloadFile } from '../useDownloadFile';
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

export const useBalanceSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/balance_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'balance_sheet.xlsx',
    ...args,
  });
};

export const useBalanceSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/balance_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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

export const useTrialBalanceSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/trial_balance_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'trial_balance_sheet.xlsx',
    ...args,
  });
};

export const useTrialBalanceSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/trial_balance_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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

export const useProfitLossSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/profit_loss_sheet',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'profit_loss_sheet.xlsx',
    ...args,
  });
};

export const useProfitLossSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/profit_loss_sheet',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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
export const useGeneralLedgerSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/general_ledger',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'general_ledger.xlsx',
    ...args,
  });
};

export const useGeneralLedgerSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/general_ledger',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'general_ledger.csv',
    ...args,
  });
};

/**
 * Retrieve journal sheet.
 */
export function useJournalSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.JOURNAL, query],
    {
      method: 'get',
      url: '/financial_statements/journal',
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

export const useJournalSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/journal',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'journal.xlsx',
    ...args,
  });
};

export const useJournalSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/journal',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'journal.csv',
    ...args,
  });
};

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

export const useARAgingSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/receivable_aging_summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'receivable_aging_summary.xlsx',
    ...args,
  });
};

export const useARAgingSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/receivable_aging_summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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

export const useAPAgingSheetXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/payable_aging_summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'payable_aging_summary.xlsx',
    ...args,
  });
};

export const useAPAgingSheetCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/payable_aging_summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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
      select: (res) => res.data,

      ...props,
    },
  );
}

/**
 * Retrieve inventory valuation.
 */
export function useInventoryValuationTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_VALUATION, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-valuation',
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

export const useInventoryValuationXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-valuation',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'inventory_valuation.xlsx',
    ...args,
  });
};

export const useInventoryValuationCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-valuation',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'inventory_valuation.csv',
    ...args,
  });
};

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
      select: (res) => res.data,
      ...props,
    },
  );
}

export function usePurchasesByItemsTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PURCHASES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/purchases-by-items',
      params: query,
      headers: {
        accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const usePurchasesByItemsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/purchases-by-items',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'purchases_by_items.csv',
    ...args,
  });
};

export const usePurchasesByItemsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/purchases-by-items',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'purchases_by_items.xlsx',
    ...args,
  });
};

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
      ...props,
    },
  );
}

/**
 * Retrieves sales by items table format.
 */
export function useSalesByItemsTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/sales-by-items',
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

export const useSalesByItemsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-by-items',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'sales_by_items.csv',
    ...args,
  });
};

export const useSalesByItemsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-by-items',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'sales_by_items.xlsx',
    ...args,
  });
};

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

export const useCustomerBalanceSummaryXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/customer-balance-summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'customer_balance_summary.xlsx',
    ...args,
  });
};

export const useCustomerBalanceSummaryCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/customer-balance-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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

export const useCustomersTransactionsXlsxExport = (query, args) => {
  const url = '/financial_statements/transactions-by-customers';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
    params: query,
  };
  const filename = 'customers_transactions.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useCustomersTransactionsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/transactions-by-customers',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
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

export const useVendorsTransactionsXlsxExport = (query, args) => {
  const url = '/financial_statements/transactions-by-vendors';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
    params: query,
  };
  const filename = 'transactions_by_vendor.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useVendorsTransactionsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/transactions-by-vendors',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'transactions_by_vendor.csv',
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
        tableRows: res.data.table.rows,
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

export const useCashFlowStatementXlsxExport = (query, args) => {
  const url = '/financial_statements/cash-flow';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
    params: query,
  };
  const filename = 'cashflow_statement.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useCashFlowStatementCsvExport = (query, args) => {
  const url = '/financial_statements/cash-flow';
  const config = {
    headers: {
      accept: 'application/csv',
    },
    params: query,
  };
  const filename = 'cashflow_statement.csv';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

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
        tableRows: res.data.table.rows,
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

export const useInventoryItemDetailsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-item-details',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'inventory_item_details.xlsx',
    ...args,
  });
};

export const useInventoryItemDetailsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-item-details',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'inventory_item_details.csv',
    ...args,
  });
};

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

export const useSalesTaxLiabilitySummaryXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'sales_tax_liability_summary.xlsx',
    ...args,
  });
};

export const useSalesTaxLiabilitySummaryCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'sales_tax_liability_summary.csv',
    ...args,
  });
};
