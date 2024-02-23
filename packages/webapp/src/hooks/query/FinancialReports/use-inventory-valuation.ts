// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve inventory valuation.
 */
export function useInventoryValuation(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_VALUATION, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-valuation',
      params: query,
    },
    {
      select: (res) => res.data,

      ...props,
    },
  );
}

/**
 * Retrieve inventory valuation.
 */
export function useInventoryValuationTable(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_VALUATION, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-valuation',
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

export const useInventoryValuationXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-valuation',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'inventory_valuation.xlsx',
    ...args,
  });
};

export const useInventoryValuationCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-valuation',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'inventory_valuation.csv',
    ...args,
  });
};

/**
 * Retrieves the inventory valuation pdf document data.
 */
export function useInventoryValuationPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/inventory-valuation`,
    params: query,
  });
}
