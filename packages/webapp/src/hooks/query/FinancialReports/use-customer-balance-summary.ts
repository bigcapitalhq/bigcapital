// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the pdf content of customers balance summary.
 */
export function useCustomerBalanceSummaryPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/customer-balance-summary`,
    params: query,
  });
}
