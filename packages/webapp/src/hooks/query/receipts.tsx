// @ts-nocheck
import {
  useQueryClient,
  useMutation,
  UseQueryResult,
  UseQueryOptions,
  useQuery,
} from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination, transformToCamelCase } from '@/utils';
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

export interface GetSaleReceiptMailStateResponse {
  attachReceipt: boolean;

  closedAtDate: string;
  closedAtDateFormatted: string;

  companyName: string;
  customerName: string;

  formatArgs: Record<string, any>;

  from: string[];
  fromOptions: Array<{ mail: string; label: string; primary: boolean; }>;
  message: string;

  receiptDate: string;
  receiptDateFormatted: string;

  subject: string;

  subtotal: number;
  subtotalFormatted: string;

  to: string[];
  toOptions: Array<{ mail: string; label: string; primary: boolean; }>;

  // # Discount
  discountAmount: number;
  discountAmountFormatted: string;
  discountLabel: string;
  discountPercentage: number | null;
  discountPercentageFormatted: string;

  // # Adjustment
  adjustment: number,
  adjustmentFormatted: string,

  // # Total
  total: number;
  totalFormatted: string;

  companyLogoUri?: string | null;
  primaryColor?: string | null;

  entries: Array<{
    name: string;
    quantity: number;
    quantityFormatted: string;
    rate: number;
    rateFormatted: string;
    total: number;
    totalFormatted: string
  }>,
  receiptNumber: string;
}

export function useSaleReceiptMailState(
  receiptId: number,
  props?: UseQueryOptions<GetSaleReceiptMailStateResponse, Error>,
): UseQueryResult<GetSaleReceiptMailStateResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetSaleReceiptMailStateResponse, Error>(
    [t.SALE_RECEIPT_MAIL_OPTIONS, receiptId],
    () =>
      apiRequest
        .get(`sales/receipts/${receiptId}/mail`)
        .then((res) => transformToCamelCase(res.data.data)),
  );
}

export interface IGetReceiptStateResponse {
  defaultTemplateId: number;
}

export function useGetReceiptState(
  options?: UseQueryOptions<IGetReceiptStateResponse, Error>,
): UseQueryResult<IGetReceiptStateResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<IGetReceiptStateResponse, Error>(
    ['SALE_RECEIPT_STATE'],
    () =>
      apiRequest
        .get(`/sales/receipts/state`)
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}

interface GetReceiptHtmlResponse {
  htmlContent: string;
}

/**
 * Retrieves the sale receipt html content.
 * @param {number} receiptId
 * @param {UseQueryOptions<string, Error>} options
 * @returns {UseQueryResult<GetReceiptHtmlResponse, Error>}
 */
export const useGetSaleReceiptHtml = (
  receiptId: number,
  options?: UseQueryOptions<string, Error>,
): UseQueryResult<GetReceiptHtmlResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetReceiptHtmlResponse, Error>(
    ['SALE_RECEIPT_HTML', receiptId],
    () =>
      apiRequest
        .get(`sales/receipts/${receiptId}`, {
          headers: {
            Accept: 'application/json+html',
          },
        })
        .then((res) => transformToCamelCase(res.data)),
    { ...options },
  );
};
