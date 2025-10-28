// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve A/P aging summary report.
 */
export function useAPAgingSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.AP_AGING_SUMMARY, query],
    {
      method: 'get',
      url: '/reports/payable-aging-summary',
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
    url: '/reports/payable-aging-summary',
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
    url: '/reports/payable-aging-summary',
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
 * Retrieves the A/P aging summary pdf document.
 */
export function useAPAgingSummaryPdf(query = {}) {
  return useRequestPdf({
    url: `/reports/payable-aging-summary`,
    params: query,
  });
}
