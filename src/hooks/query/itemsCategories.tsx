// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate items categories.
  queryClient.invalidateQueries(t.ITEMS_CATEGORIES);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
};

/**
 * Creates a new item category.
 */
export function useCreateItemCategory(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('item_categories', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the item category.
 */
export function useEditItemCategory(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`item_categories/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific item category.
        queryClient.invalidateQueries([t.ITEM_CATEGORY, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given item category.
 */
export function useDeleteItemCategory(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`item_categories/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific item category.
      queryClient.invalidateQueries([t.ITEM_CATEGORY, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}


const transformCategories = (res) => ({
  itemsCategories: res.data.item_categories,
  pagination: res.data.pagination,  
});

/**
 * Retrieve the items categories.
 */
export function useItemsCategories(query, props) {
  return useRequestQuery(
    [t.ITEMS_CATEGORIES, query],
    { method: 'get', url: `item_categories`, params: query },
    {
      select: transformCategories,
      defaultData: {
        itemsCategories: [],
        pagination: {}
      },
      ...props,
    },
  );
}

/**
 * Retrieve the item category details.
 * @param {number} id - Item category.
 */
export function useItemCategory(id, props) {
  return useRequestQuery(
    [t.ITEM_CATEGORY, id],
    { method: 'get', url: `item_categories/${id}` },
    {
      select: (res) => res.data.category,
      defaultData: {},
      ...props,
    },
  );
}
