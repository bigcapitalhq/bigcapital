// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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

export const useVendorBalanceSummaryPdfExport = (query = {}) => {
  return useRequestPdf({
    url: 'financial_statements/vendor-balance-summary',
    params: query,
  });
};
