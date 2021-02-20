import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

const invalidateQueries = (queryClient) => {
  queryClient.invalidateQueries('INVENTORY_ADJUSTMENTS');

  queryClient.invalidateQueries('ITEMS');
  queryClient.invalidateQueries('ITEM');
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
        invalidateQueries(queryClient)
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
      onSuccess: () => {
        invalidateQueries(queryClient)
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

  const states = useQuery(
    ['INVENTORY_ADJUSTMENTS', query],
    () => apiRequest.get('inventory_adjustments', { params: query })  
      .then(inventoryAdjustmentsTransformer),
    props,
  );
  return {
    ...states,
    data: defaultTo(states.data, {
      transactions: [],
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
        pagesCount: 0,
      }
    })
  }
}