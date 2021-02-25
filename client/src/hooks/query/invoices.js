import { defaultTo } from 'lodash';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

/**
 * Creates a new sale invoice.
 */
export function useCreateInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/invoices', values), {
    onSuccess: (values) => {
      queryClient.invalidateQueries('SALE_INVOICES');

      queryClient.invalidateQueries('CUSTOMERS');
      queryClient.invalidateQueries(['CUSTOMER', values.customer_id]);

      queryClient.invalidateQueries(['SETTINGS', 'INVOICES']);
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
        queryClient.invalidateQueries('SALE_INVOICES');
        queryClient.invalidateQueries(['SALE_INVOICE', id]);
        queryClient.invalidateQueries('CUSTOMERS');
        queryClient.invalidateQueries(['CUSTOMER', values.customer_id]);
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
      queryClient.invalidateQueries('SALE_INVOICES');
      queryClient.invalidateQueries(['SALE_INVOICE', id]);
      queryClient.invalidateQueries('CUSTOMERS');
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['SALE_INVOICES', query],
    () => apiRequest.get('sales/invoices', { params: query }),
    {
      select: (res) => ({
        invoices: res.data.sales_invoices,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      invoices: [],
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
      },
      filterMeta: {},
    }),
  };
}

/**
 * Marks the sale invoice as delivered.
 */
export function useDeliverInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/invoices/${id}/deliver`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries('SALE_INVOICES');
      queryClient.invalidateQueries(['SALE_INVOICE', id]);
      queryClient.invalidateQueries('CUSTOMERS');
    },
    ...props,
  });
}

/**
 * Retrieve the sale invoice details.
 */
export function useInvoice(id, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['SALE_INVOICE', id],
    () => apiRequest.get(`sales/invoices/${id}`),
    {
      select: (res) => res.data.sale_invoice,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Retrieve due invoices of the given customer id.
 * @param {number} customerId - Customer id.
 */
export function useDueInvoices(customerId, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['SALE_INVOICE_DUE', customerId],
    () =>
      apiRequest.get(`sales/invoices/payable`, {
        params: { customer_id: customerId },
      }),
    {
      select: (res) => res.data.sales_invoices,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  };
}
