// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve inventory item detail report.
 */
export function useInventoryItemDetailsReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.INVENTORY_ITEM_DETAILS, query],
    {
      method: 'get',
      url: '/financial_statements/inventory-item-details',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => ({
        columns: res.data.table.columns,
        query: res.data.query,
        meta: res.data.meta,
        tableRows: res.data.table.rows,
      }),
      defaultData: {
        tableRows: [],
        columns: [],
        query: {},
        meta: {},
      },
      ...props,
    },
  );
}

export const useInventoryItemDetailsXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-item-details',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'inventory_item_details.xlsx',
    ...args,
  });
};

export const useInventoryItemDetailsCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/inventory-item-details',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'inventory_item_details.csv',
    ...args,
  });
};

/**
 * Retrieves the balance sheet pdf document data.
 */
export function useInventoryItemDetailsPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/inventory-item-details`,
    params: query,
  });
}
