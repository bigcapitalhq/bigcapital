// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve purchases by items.
 */
export function usePurchasesByItems(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PURCHASES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/purchases-by-items',
      params: query,
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export function usePurchasesByItemsTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.PURCHASES_BY_ITEMS, query],
    {
      method: 'get',
      url: '/financial_statements/purchases-by-items',
      params: query,
      headers: {
        accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const usePurchasesByItemsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/purchases-by-items',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'purchases_by_items.csv',
    ...args,
  });
};

export const usePurchasesByItemsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/purchases-by-items',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'purchases_by_items.xlsx',
    ...args,
  });
};

/**
 * Retrieves the pdf document of purchases by items.
 */
export const usePurchasesByItemsPdfExport = (query = {}) => {
  return useRequestPdf({
    url: '/financial_statements/purchases-by-items',
    params: query,
  });
};
