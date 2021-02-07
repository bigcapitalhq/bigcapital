import { useQueryClient, useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';

// Invoices transformer.
const invoicesTransformer = (response) => {
  return {
    invoices: response.data.sales_invoices,
    pagination: response.data.pagination,
    filterMeta: response.data.filter_meta,
  };
};

const invoiceTransformer = (response) => {
  return {
    invoice: response.data.invoice,
  }
}
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
    (id, values) => ApiService.post(`sales/invoices/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_INVOICES');
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
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_INVOICES');
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  return useQuery(
    ['SALE_INVOICES', query],
    () =>
      ApiService.get('sales/invoices', { params: query }).then(
        invoicesTransformer,
      ),
    {
      initialData: {
        saleInvoices: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0,
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

  return useMutation(
    (id) => ApiService.delete(`sales/invoices/${id}/deliver`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_INVOICES');
      },
      ...props,
    },
  );
}

/**
 * Retrieve the sale invoice details.
 */
export function useInvoice(id, props) {
  return useQuery(['SALE_INVOICE', id], () =>
    ApiService.get(`sales/invoices/${id}`).then(invoiceTransformer),
    {
      initialData: {},
      ...props
    }
  );
}
