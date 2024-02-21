// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

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
 * Retrieves the pdf content of customers transactions.
 */
export const useCustomersTransactionsPdfExport = (query = {}) => {
  return useRequestPdf({
    url: '/financial_statements/transactions-by-customers',
    params: query,
  });
};
