// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination } from '@/utils';
import { useRequestPdf } from '../useRequestPdf';
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

  // Invalidate the transactions by reference.
  queryClient.invalidateQueries(t.TRANSACTIONS_BY_REFERENCE);

  // Invalidate the cashflow transactions.
  queryClient.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
  queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

  // Invalidate
  queryClient.invalidateQueries(t.ITEM_ASSOCIATED_WITH_RECEIPTS);

  // Invalidate item warehouses.
  queryClient.invalidateQueries(t.ITEM_WAREHOUSES_LOCATION);

  // Invalidate the settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_RECEIPTS]);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
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
  receipts: res.data.data,
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
 * @param {number} receiptId -
 */
export function usePdfReceipt(receiptId: number) {
  return useRequestPdf({ url: `sales/receipts/${receiptId}` });
}

export function useRefreshReceipts() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.SALE_RECEIPTS);
    },
  };
}

export function useCreateNotifyReceiptBySMS(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();
  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/receipts/${id}/notify-by-sms`, values),
    {
      onSuccess: (res, [id, values]) => {
        queryClient.invalidateQueries([t.NOTIFY_SALE_RECEIPT_BY_SMS, id]);

        // Invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useReceiptSMSDetail(receiptId, props, requestProps) {
  return useRequestQuery(
    [t.SALE_RECEIPT_SMS_DETAIL, receiptId],
    {
      method: 'get',
      url: `sales/receipts/${receiptId}/sms-details`,
      ...requestProps,
    },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

/**
 *
 */
export function useSendSaleReceiptMail(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/receipts/${id}/mail`, values),
    {
      onSuccess: () => {
        // Invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useSaleReceiptDefaultOptions(invoiceId, props) {
  return useRequestQuery(
    [t.SALE_RECEIPT_MAIL_OPTIONS, invoiceId],
    {
      method: 'get',
      url: `sales/receipts/${invoiceId}/mail`,
    },
    {
      select: (res) => res.data.data,
      ...props,
    },
  );
}
