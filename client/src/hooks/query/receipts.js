import { useQueryClient, useQuery, useMutation } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

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
    ([id, values]) => ApiService.post(`sales/receipts/${id}`, values),
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
  const states = useQuery(
    ['SALE_RECEIPTS', query],
    () => ApiService.get('sales/receipts', { params: query }),
    {
      select: (response) => ({
        receipts: response.data.sale_receipts,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      receipts: [],
      pagination: {
        page: 1,
        page_size: 12,
        total: 0,
      },
      filterMeta: {},
    }),
  };
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useReceipt(id, props) {
  const states = useQuery(
    ['SALE_RECEIPT', id],
    () => ApiService.get(`sales/receipts/${id}`),
    {
      select: (res) => res.data.sale_receipt,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  }
}
