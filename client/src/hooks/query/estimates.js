import { useQueryClient, useQuery, useMutation } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';
import { transformPagination } from 'utils';

/**
 * Creates a new sale estimate.
 */
export function useCreateEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/estimates', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_ESTIMATES');
      queryClient.invalidateQueries(['SETTINGS', 'ESTIMATES']);
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
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
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

  const states = useQuery(
    ['SALE_ESTIMATE', id],
    () => apiRequest.get(`sales/estimates/${id}`),
    {
      select: (res) => res.data.estimate,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useEstimates(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['SALE_ESTIMATES', query],
    () => apiRequest.get('sales/estimates', { params: query }),
    {
      select: (res) => ({
        estimates: res.data.sales_estimates,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      estimates: [],
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
 * Deletes the given sale invoice.
 */
export function useDeleteEstimate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/estimates/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('SALE_ESTIMATES');
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
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/estimates/${id}/approve`),
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
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/estimates/${id}/reject`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SALE_ESTIMATES');
      },
      ...props,
    },
  );
}
