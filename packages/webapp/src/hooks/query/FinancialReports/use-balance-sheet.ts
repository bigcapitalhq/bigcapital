// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the balance sheet pdf document data.
 */
export function useBalanceSheetPdf() {
  return useRequestPdf(`financial_statements/balance_sheet`);
}
