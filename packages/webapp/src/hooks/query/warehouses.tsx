// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { transformPagination } from '@/utils';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate warehouses.
  queryClient.invalidateQueries(t.WAREHOUSES);
  queryClient.invalidateQueries(t.WAREHOUSE);

  // Invalidate warehouses transfers.
  queryClient.invalidateQueries(t.WAREHOUSE_TRANSFERS);

  queryClient.invalidateQueries(t.DASHBOARD_META);
};

/**
 * Create a new warehouse.
 */
export function useCreateWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('warehouses', values), {
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given warehouse.
 */
export function useEditWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`warehouses/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific sale invoice.
        queryClient.invalidateQueries([t.WAREHOUSE, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given warehouse.
 */
export function useDeleteWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`warehouses/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific warehouse.
      queryClient.invalidateQueries([t.WAREHOUSE, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve Warehouses list.
 */
export function useWarehouses(query, props) {
  return useRequestQuery(
    [t.WAREHOUSES, query],
    { method: 'get', url: 'warehouses', params: query },
    {
      select: (res) => res.data.warehouses,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve the warehouse details.
 * @param {number}
 */
export function useWarehouse(id, props, requestProps) {
  return useRequestQuery(
    [t.WAREHOUSE, id],
    { method: 'get', url: `warehouses/${id}`, ...requestProps },
    {
      select: (res) => res.data.warehouse,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Activate the given warehouse.
 */
export function useActivateWarehouses(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`warehouses/activate`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Mark primary the given branch.
 */
export function useMarkWarehouseAsPrimary(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`warehouses/${id}/mark-primary`), {
    onSuccess: (res, id) => {
      // Invalidate specific inventory adjustment.
      queryClient.invalidateQueries([t.WAREHOUSE, id]);

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
