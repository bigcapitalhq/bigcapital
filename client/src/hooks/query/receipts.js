import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { useRequestPdf } from '../useRequestPdf';
import useApiRequest from '../useRequest';
import { transformPagination } from 'utils';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate receipts.
  queryClient.invalidateQueries(t.SALE_RECEIPTS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate the settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_RECEIPTS]);
};

/**
 * Creates a new sale invoice.
 */
export function useCreateReceipt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/receipts', values), {
    onSuccess: () => {
      // Invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditReceipt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/receipts/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific receipt.
        queryClient.invalidateQueries([t.SALE_RECEIPT, id]);

        // Invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteReceipt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/receipts/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific receipt.
      queryClient.invalidateQueries([t.SALE_RECEIPT, id]);

      // Invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Deletes the given sale invoice.
 */
export function useCloseReceipt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/receipts/${id}/close`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries([t.SALE_RECEIPT, id]);

      // Invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const transformReceipts = (res) => ({
  receipts: res.data.sales_receipts,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useReceipts(query, props) {
  return useRequestQuery(
    ['SALE_RECEIPTS', query],
    { method: 'get', url: 'sales/receipts', params: query },
    {
      select: transformReceipts,
      defaultData: {
        receipts: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useReceipt(id, props) {
  return useRequestQuery(
    ['SALE_RECEIPT', id],
    { method: 'get', url: `sales/receipts/${id}` },
    {
      select: (res) => res.data.sale_receipt,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the receipt pdf document data.
 */
export function usePdfReceipt(ReceiptId) {
  return useRequestPdf(`sales/receipts/${ReceiptId}`);
}

export function useRefreshReceipts() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.SALE_RECEIPTS);
    },
  };
}
