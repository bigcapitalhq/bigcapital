import { useMutation, useQuery, useQueryClient } from 'react-query';
import { transformPagination, transformResponse } from 'utils';
import { useQueryTenant } from '../useQueryTenant';
import useApiRequest from '../useRequest';
import t from './types';

const DEFAULT_PAGINATION = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);

  // Invalidate items categories.
  queryClient.invalidateQueries(t.ITEMS_CATEGORIES);
};

/**
 * Creates a new item.
 */
export function useCreateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('items', values), {
    onSuccess: (res, values) => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given item.
 */
export function useEditItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`items/${id}`, values), {
    onSuccess: (res, [id, values]) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Deletes the given item.
 */
export function useDeleteItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`items/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Activate the given item.
 */
 export function useActivateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`items/${id}/activate`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Inactivate the given item.
 */
export function useInactivateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`items/${id}/inactivate`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

// Transformes items response.
const transformItemsResponse = (response) => {
  return {
    items: response.data.items,
    pagination: transformPagination(
      transformResponse(response.data.pagination)
    ),
    filterMeta: transformResponse(response.data.filter_meta),
  };
};

/**
 * Retrieves items list.
 */
export function useItems(query, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.ITEMS, query],
    () => apiRequest.get(`items`, { params: query }).then(transformItemsResponse),
    {
      initialDataUpdatedAt: 0,
      initialData: {
        items: [],
        pagination: DEFAULT_PAGINATION,
        filterMeta: {},
      },
      ...props,
    }
  );
}

/**
 * Retrieve details of the given item.
 * @param {number} id - Item id.
 */
export function useItem(id, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.ITEM, id],
    () => apiRequest.get(`items/${id}`).then((response) => response.data.item),
    {
      initialDataUpdatedAt: 0,
      initialData: {},
      ...props
    },
  );
}