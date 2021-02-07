import { useQueryClient, useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';

const invoicesTransformer = (response) => {
  return {
    estimates: response.data.sale_invoices,
    pagination: response.data.pagination,
  };
};

/**
 * Creates a new sale estimate.
 */
export function useCreateEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('sales/estimates', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_ESTIMATES');
    },
    ...props,
  });
}

/**
 * Edits the given sale estimate.
 */
export function useEditEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id, values) => ApiService.post(`sales/estimates/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation((id) => ApiService.delete(`sales/estimates/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_ESTIMATES');
    },
    ...props,
  });
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useEstimates(query, props) {
  return useQuery(
    ['SALE_INVOICES', query],
    () =>
      ApiService.get('sales/estimates', { params: query }).then(
        invoicesTransformer,
      ),
    {
      initialData: {
        saleEstimates: [],
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
 * Mark the given estimate as delivered.
 */
export function useDeliverEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id) => ApiService.delete(`sales/estimates/${id}/deliver`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
      },
      ...props,
    },
  );
}

/**
 * Mark the given estimate as approved.
 */
export function useApproveEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id) => ApiService.delete(`sales/estimates/${id}/deliver`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
      },
      ...props,
    },
  );
}

/**
 * Mark the given estimate as rejected.
 */
export function useRejectEstimate(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (id) => ApiService.delete(`sales/estimates/${id}/reject`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
      },
      ...props,
    },
  );
}
