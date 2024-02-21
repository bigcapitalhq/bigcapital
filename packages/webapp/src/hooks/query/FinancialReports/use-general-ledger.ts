// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the general ledger pdf document data.
 */
export function useGeneralLedgerPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/general_ledger`,
    params: query
  });
}
