// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the trial balance sheet pdf document data.
 */
export function useTrialBalanceSheetPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/trial_balance_sheet`,
    params: query,
  });
}
