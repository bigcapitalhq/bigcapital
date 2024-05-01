// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import { useRequestPdf } from '../useRequestPdf';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate invoices.
  queryClient.invalidateQueries(t.SALE_INVOICES);
  queryClient.invalidateQueries(t.SALE_INVOICE);

  // Invalidate customers.
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_INVOICES]);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate transactions by reference.
  queryClient.invalidateQueries(t.TRANSACTIONS_BY_REFERENCE);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate reconcile.
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTE);
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTES);

  // Invalidate
  queryClient.invalidateQueries(t.ITEM_ASSOCIATED_WITH_INVOICES);

  // Invalidate item warehouses.
  queryClient.invalidateQueries(t.ITEM_WAREHOUSES_LOCATION);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

/**
 * Creates a new sale invoice.
 */
export function useCreateInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/invoices', values), {
    onSuccess: (res, values) => {
      // Invalidate invoice customer.
      queryClient.invalidateQueries([t.CUSTOMER, values.customer_id]);

      // Invalidate estimates.
      queryClient.invalidateQueries(t.SALE_ESTIMATES);
      queryClient.invalidateQueries(t.SALE_ESTIMATE);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/invoices/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific sale invoice.
        queryClient.invalidateQueries([t.SALE_INVOICE, id]);

        // Invalidate invoice customer.
        queryClient.invalidateQueries([t.CUSTOMER, values.customer_id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/invoices/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific invoice.
      queryClient.invalidateQueries([t.SALE_INVOICE, id]);

      // Invalidate estimates.
      queryClient.invalidateQueries(t.SALE_ESTIMATES);
      queryClient.invalidateQueries(t.SALE_ESTIMATE);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const transformInvoices = (res) => ({
  invoices: res.data.sales_invoices,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  return useRequestQuery(
    [t.SALE_INVOICES, query],
    { method: 'get', url: 'sales/invoices', params: query },
    {
      select: transformInvoices,
      defaultData: {
        invoices: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Marks the sale invoice as delivered.
 */
export function useDeliverInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (invoiceId) => apiRequest.post(`sales/invoices/${invoiceId}/deliver`),
    {
      onSuccess: (res, invoiceId) => {
        // Invalidate specific invoice.
        queryClient.invalidateQueries([t.SALE_INVOICE, invoiceId]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the sale invoice details.
 * @param {number} invoiceId - Invoice id.
 */
export function useInvoice(invoiceId, props, requestProps) {
  return useRequestQuery(
    [t.SALE_INVOICE, invoiceId],
    { method: 'get', url: `sales/invoices/${invoiceId}`, ...requestProps },
    {
      select: (res) => res.data.sale_invoice,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the invoice pdf document data.
 */
export function usePdfInvoice(invoiceId) {
  return useRequestPdf({
    url: `sales/invoices/${invoiceId}`,
  });
}

/**
 * Retrieve due invoices of the given customer id.
 * @param {number} customerId - Customer id.
 */
export function useDueInvoices(customerId, props) {
  return useRequestQuery(
    [t.SALE_INVOICES, t.SALE_INVOICES_DUE, customerId],
    {
      method: 'get',
      url: `sales/invoices/payable`,
      params: { customer_id: customerId },
    },
    {
      select: (res) => res.data.sales_invoices,
      defaultData: [],
      ...props,
    },
  );
}

export function useRefreshInvoices() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.SALE_INVOICES);
    },
  };
}

export function useCreateBadDebt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/invoices/${id}/writeoff`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.BAD_DEBT, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useCancelBadDebt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/invoices/${id}/writeoff/cancel`),
    {
      onSuccess: (res, id) => {
        // Invalidate
        queryClient.invalidateQueries([t.CANCEL_BAD_DEBT, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useCreateNotifyInvoiceBySMS(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/invoices/${id}/notify-by-sms`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.NOTIFY_SALE_INVOICE_BY_SMS, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useInvoiceSMSDetail(invoiceId, query, props) {
  return useRequestQuery(
    [t.SALE_INVOICE_SMS_DETAIL, invoiceId, query],
    {
      method: 'get',
      url: `sales/invoices/${invoiceId}/sms-details`,
      params: query,
    },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useInvoicePaymentTransactions(invoiceId, props) {
  return useRequestQuery(
    [t.SALE_INVOICE_PAYMENT_TRANSACTIONS, invoiceId],
    {
      method: 'get',
      url: `sales/invoices/${invoiceId}/payment-transactions`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

export function useSendSaleInvoiceMail(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/invoices/${id}/mail`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useSaleInvoiceDefaultOptions(invoiceId, props) {
  return useRequestQuery(
    [t.SALE_INVOICE_DEFAULT_OPTIONS, invoiceId],
    {
      method: 'get',
      url: `sales/invoices/${invoiceId}/mail`,
    },
    {
      select: (res) => res.data.data,
      ...props,
    },
  );
}
