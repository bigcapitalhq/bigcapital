import { useQuery, useMutation, useQueryClient } from 'react-query';
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

/**
 * Retrieve the items categories.
 */
export function useItemsCategories(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.ITEMS_CATEGORIES, query],
    () => apiRequest.get(`item_categories`, { params: query }),
    {
      select: (response) => ({
        itemsCategories: response.data.item_categories,
        pagination: response.data.pagination,
      }),
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          item_categories: [],
          pagination: {}
        },
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
  const apiRequest = useApiRequest();

  return useQuery(
    [t.ITEM_CATEGORY, id],
    () =>
      apiRequest.get(`item_categories/${id}`).then((res) => res.data.category),
    {
      initialDataUpdatedAt: 0,
      initialData: {},
      ...props,
    },
  );
}
