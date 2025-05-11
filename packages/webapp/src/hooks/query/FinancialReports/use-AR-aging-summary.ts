// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';
/**
 * Retrieve A/R aging summary report.
 */
export function useARAgingSummaryReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.AR_AGING_SUMMARY, query],
    {
      method: 'get',
      url: '/reports/receivable-aging-summary',
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
    url: '/reports/receivable-aging-summary',
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
    url: '/reports/receivable-aging-summary',
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
 * Retrieves the A/R aging summary pdf document data.
 */
export function useARAgingSummaryPdf(query = {}) {
  return useRequestPdf({
    url: `/reports/receivable_aging_summary`,
    params: query,
  });
}
