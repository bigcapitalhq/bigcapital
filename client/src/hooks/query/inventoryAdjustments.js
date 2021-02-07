import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';

/**
 * Creates the inventory adjustment to the given item.
 */
export function useCreateInventoryAdjustment(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (values) => ApiService.post('inventory_adjustments/quick', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('INVENTORY_ADJUSTMENTS');
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

  return useMutation(
    (id) => ApiService.delete(`inventory_adjustments/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('INVENTORY_ADJUSTMENTS');
      },
      ...props
    },
  );
}

const inventoryAdjustmentsTransformer = (response) => {
  return {
    transactions: response.data.inventoy_adjustments,
    pagination: response.data.pagination,
  };
}

/**
 * Retrieve inventory adjustment list with pagination meta.
 */
export function useInventoryAdjustments(query, props) {
  return useQuery(
    ['INVENTORY_ADJUSTMENTS', query],
    () => ApiService.get('inventory_adjustments', { params: query })  
      .then(inventoryAdjustmentsTransformer),
    {
      initialData: {
        transactions: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0
        },
      },
      ...props,
    },
  );
}