// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve profit/loss (P&L) sheet.
 */
export function useProfitLossSheet(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PROFIT_LOSS_SHEET, query],
    {
      method: 'get',
      url: '/reports/profit-loss-sheet',
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
    url: '/reports/profit-loss-sheet',
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
    url: '/reports/profit-loss-sheet',
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
 * Retrieves the profit/loss sheet pdf document data.
 */
export function useProfitLossSheetPdf(query = {}) {
  return useRequestPdf({
    url: `/reports/profit-loss-sheet`,
    params: query,
  });
}
