import { useQueryClient, useQuery, useMutation } from 'react-query';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate invoices.
  queryClient.invalidateQueries(t.SALE_INVOICES);

  // Invalidate customers.
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_INVOICES]);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);
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

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.SALE_INVOICES, query],
    () => apiRequest.get('sales/invoices', { params: query }),
    {
      select: (res) => ({
        invoices: res.data.sales_invoices,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          sales_invoices: [],
          pagination: {
            page: 1,
            pageSize: 12,
            total: 0,
          },
          filter_meta: {},
        },
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
export function useInvoice(invoiceId, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.SALE_INVOICE, invoiceId],
    () => apiRequest.get(`sales/invoices/${invoiceId}`),
    {
      select: (res) => res.data.sale_invoice,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          sale_invoice: {}
        },
      },
      ...props,
    },
  );
}

/**
 * Retrieve due invoices of the given customer id.
 * @param {number} customerId - Customer id.
 */
export function useDueInvoices(customerId, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.SALE_INVOICES, t.SALE_INVOICES_DUE, customerId],
    () =>
      apiRequest.get(`sales/invoices/payable`, {
        params: { customer_id: customerId },
      }),
    {
      select: (res) => res.data.sales_invoices,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          sales_invoices: [],
        },
      },
      ...props,
    },
  );
}
