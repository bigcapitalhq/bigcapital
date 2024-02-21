// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve sales by items.
 */
export function useSalesByItems(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/sales-by-items',
      params: query,
    },
    {
      ...props,
    },
  );
}

/**
 * Retrieves sales by items table format.
 */
export function useSalesByItemsTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/sales-by-items',
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

export const useSalesByItemsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-by-items',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'sales_by_items.csv',
    ...args,
  });
};

export const useSalesByItemsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-by-items',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'sales_by_items.xlsx',
    ...args,
  });
};

export const useSalesByItemsPdfExport = (query = {}) => {
  return useRequestPdf({
    url: '/financial_statements/sales-by-items',
    params: query,
  });
};
