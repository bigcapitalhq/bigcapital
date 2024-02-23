// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the journal sheet pdf content.
 */
export const useJournalSheetPdf = (query = {}) => {
  return useRequestPdf({
    url: `/financial_statements/journal`,
    params: query,
  });
};
