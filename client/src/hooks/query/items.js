import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';
import { transformResponse } from 'utils';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

/**
 * Creates a new item.
 */
export function useCreateItem(props) {
  return useMutation((values) => ApiService.post('items', values), props);
}

/**
 * Edits the given item.
 */
export function useEditItem(props) {
  const queryClient = useQueryClient();

  return useMutation(([id, values]) => ApiService.post(`items/${id}`, values), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
    },
    ...props,
  });
}

/**
 * Deletes the given item.
 */
export function useDeleteItem(props) {
  const queryClient = useQueryClient();
  
  return useMutation((id) => ApiService.delete(`items/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
    },
    ...props,
  });
}

// Transformes items response.
const transformItemsResponse = (response) => {
  return {
    items: response.data.items,
    pagination: transformResponse(response.data.pagination),
    filterMeta: transformResponse(response.data.filter_meta),
  };
};

/**
 * Retrieves items list.
 */
export function useItems(query, props) {
  return useQuery(
    ['ITEMS', query],
    () =>
      ApiService.get(`items`, { params: query }).then(transformItemsResponse),
    {
      initialData: {
        items: [],
        pagination: defaultPagination,
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve details of the given item.
 * @param {number} id - Item id.
 */
export function useItem(id, props) {
  return useQuery(
    ['ITEM', id],
    () => ApiService.get(`items/${id}`).then((response) => response.data.item),
    props,
  );
}

/**
 * Activate the given item.
 */
export function useActivateItem(props) {
  const queryClient = useQueryClient();

  return useMutation((id) => ApiService.post(`items/${id}/activate`), {
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

  return useMutation((id) => ApiService.post(`items/${id}/inactivate`), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS');
      queryClient.invalidateQueries('ITEM');
    },
    ...props,
  });
}
