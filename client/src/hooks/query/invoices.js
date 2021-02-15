import { defaultTo } from 'lodash';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

/**
 * Creates a new sale invoice.
 */
export function useCreateInvoice(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('sales/invoices', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_INVOICES');
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditInvoice(props) {
  const queryClient = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`sales/invoices/${id}`, values),
    {
      onSuccess: (res, id) => {
        queryClient.invalidateQueries('SALE_INVOICES');
        queryClient.invalidateQueries(['SALE_INVOICE', id]);
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

  return useMutation((id) => ApiService.delete(`sales/invoices/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries('SALE_INVOICES');
      queryClient.invalidateQueries(['SALE_INVOICE', id]);
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  const states = useQuery(
    ['SALE_INVOICES', query],
    () => ApiService.get('sales/invoices', { params: query }),
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
    })
  }
}

/**
 * Marks the sale invoice as delivered.
 */
export function useDeliverInvoice(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id) => ApiService.post(`sales/invoices/${id}/deliver`),
    {
      onSuccess: (res, id) => {
        queryClient.invalidateQueries('SALE_INVOICES');
        queryClient.invalidateQueries(['SALE_INVOICE', id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the sale invoice details.
 */
export function useInvoice(id, props) {
  const states = useQuery(['SALE_INVOICE', id], () =>
    ApiService.get(`sales/invoices/${id}`),
    { 
      select: (res) => res.data.sale_invoice,
      ...props
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}
