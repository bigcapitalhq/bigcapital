import { useQueryClient, useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';

// Receipts transformer.
const invoicesTransformer = (response) => {
  return {
    invoices: response.data.sales_invoices,
    pagination: response.data.pagination,
    filterMeta: response.data.filter_meta,
  };
};

const receiptTransformer = (response) => {
  return response.data;
}
/**
 * Creates a new sale invoice.
 */
export function useCreateReceipt(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('sales/receipts', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_RECEIPTS');
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditReceipt(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id, values) => ApiService.post(`sales/receipts/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_RECEIPTS');
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

  return useMutation((id) => ApiService.delete(`sales/receipts/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_RECEIPTS');
    },
    ...props,
  });
}

/**
 * Deletes the given sale invoice.
 */
export function useCloseReceipt(props) {
  const queryClient = useQueryClient();

  return useMutation((id) => ApiService.post(`sales/receipts/${id}/close`), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_RECEIPTS');
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useReceipts(query, props) {
  return useQuery(
    ['SALE_RECEIPTS', query],
    () =>
      ApiService
        .get('sales/receipts', { params: query })
        .then(invoicesTransformer),
    {
      initialData: {
        saleReceipts: [],
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
 * Retrieve sale invoices list with pagination meta.
 */
export function useReceipt(id, props) {
  return useQuery(
    ['SALE_RECEIPT', id],
    () =>
      ApiService
        .get(`sales/receipts/${id}`)
        .then(receiptTransformer),
    {
      initialData: {},
      ...props,
    },
  );
}
