import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import { transformPagination, transformResponse } from 'utils';
import useApiRequest from '../useRequest';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

/**
 * Creates a new item.
 */
export function useCreateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('items', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEMS_CATEGORIES');
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
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
      queryClient.invalidateQueries('ITEMS_CATEGORIES');
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
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
      queryClient.invalidateQueries('ITEMS_CATEGORIES');
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

  const result = useQuery(
    ['ITEMS', query],
    () =>
      apiRequest.get(`items`, { params: query }).then(transformItemsResponse),
    props,
  );

  return {
    ...result,
    data: defaultTo(result.data, {
      items: [],
      pagination: defaultPagination,
      filterMeta: {},
    }),
  };
}

/**
 * Retrieve details of the given item.
 * @param {number} id - Item id.
 */
export function useItem(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['ITEM', id],
    () => apiRequest.get(`items/${id}`).then((response) => response.data.item),
    props,
  );
}

/**
 * Activate the given item.
 */
export function useActivateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`items/${id}/activate`), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
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
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
    },
    ...props,
  });
}
