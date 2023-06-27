// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate inventory adjustments.
  queryClient.invalidateQueries(t.INVENTORY_ADJUSTMENTS);
  queryClient.invalidateQueries(t.INVENTORY_ADJUSTMENT);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
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

  return useMutation((id) => apiRequest.delete(`inventory_adjustments/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const inventoryAdjustmentsTransformer = (response) => {
  return {
    transactions: response.data.inventory_adjustments,
    pagination: transformPagination(response.data.pagination),
  };
};

/**
 * Retrieve inventory adjustment list with pagination meta.
 */
export function useInventoryAdjustments(query, props) {
  return useRequestQuery(
    ['INVENTORY_ADJUSTMENTS', query],
    { url: 'inventory_adjustments', params: query },
    {
      select: inventoryAdjustmentsTransformer,
      defaultData: {
        transactions: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          pagesCount: 0,
        },
      },
      ...props,
    },
  );
}

/**
 * Publishes the given inventory adjustment.
 */
export function usePublishInventoryAdjustment(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`inventory_adjustments/${id}/publish`),
    {
      onSuccess: (res, id) => {
        // Invalidate specific inventory adjustment.
        queryClient.invalidateQueries([t.INVENTORY_ADJUSTMENT, id]);

        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the inventory adjustment details.
 * @param {number} id - inventory adjustment id.
 */
export function useInventoryAdjustment(id, props, requestProps) {
  return useRequestQuery(
    [t.INVENTORY_ADJUSTMENT, id],
    { method: 'get', url: `inventory_adjustments/${id}`, ...requestProps },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}
