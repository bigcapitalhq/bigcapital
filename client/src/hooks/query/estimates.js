import { useQueryClient, useMutation } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
import useApiRequest from '../useRequest';
import { transformPagination } from 'utils';
import t from './types';


const commonInvalidateQueries = (queryClient) => {
  // Invalidate estimates.
  queryClient.invalidateQueries(t.SALE_ESTIMATES);
};

/**
 * Creates a new sale estimate.
 */
export function useCreateEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/estimates', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate the settings.
      queryClient.invalidateQueries([t.SETTING, t.SETTING_ESTIMATES]);
    },
    ...props,
  });
}

/**
 * Edits the given sale estimate.
 */
export function useEditEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/estimates/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific sale estimate.
        queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve sale estimate details.
 */
export function useEstimate(id, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.SALE_ESTIMATE, id],
    () => apiRequest.get(`sales/estimates/${id}`),
    {
      select: (res) => res.data.estimate,
      initialDataUpdatedAt: 0,
      initialData: {
        data: { estimate: {} },
      },
      ...props,
    },
  );
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useEstimates(query, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.SALE_ESTIMATES, query],
    () => apiRequest.get('sales/estimates', { params: query }),
    {
      select: (res) => ({
        estimates: res.data.sales_estimates,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      initialDataUpdatedAt: 0,
      initialData: {
        data:{ 
          sales_estimates: [],
          pagination: {
            page: 1,
            pageSize: 12,
            total: 0,
          },
          filter_meta: {},
        }
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
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/estimates/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific sale estimate.
      queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
    },
    ...props,
  });
}

/**
 * Mark the given estimate as delivered.
 */
export function useDeliverEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/estimates/${id}/deliver`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific sale estimate.
        queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
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
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/estimates/${id}/approve`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific sale estimate.
        queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
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
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/estimates/${id}/reject`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific sale estimate.
        queryClient.invalidateQueries([t.SALE_ESTIMATE, id]);
      },
      ...props,
    },
  );
}
