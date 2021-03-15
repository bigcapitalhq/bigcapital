import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';


const commonInvalidateQueries = (queryClient) => {
  // Invalidate inventory adjustments.
  queryClient.invalidateQueries(t.INVENTORY_ADJUSTMENTS);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Creates the inventory adjustment to the given item.
 */
export function useCreateInventoryAdjustment(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('inventory_adjustments/quick', values),
    {
      onSuccess: () => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the inventory adjustment transaction.
 */
export function useDeleteInventoryAdjustment(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`inventory_adjustments/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props
    },
  );
}

const inventoryAdjustmentsTransformer = (response) => {
  return {
    transactions: response.data.inventoy_adjustments,
    pagination: transformPagination(response.data.pagination),
  };
}

/**
 * Retrieve inventory adjustment list with pagination meta.
 */
export function useInventoryAdjustments(query, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    ['INVENTORY_ADJUSTMENTS', query],
    () => apiRequest.get('inventory_adjustments', { params: query })  
      .then(inventoryAdjustmentsTransformer),
    {
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          transactions: [],
          pagination: {
            page: 1,
            pageSize: 12,
            total: 0,
            pagesCount: 0,
          },
        }
      },
      ...props
    },
  );
}