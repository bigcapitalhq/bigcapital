import { useQuery, useMutation, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';

/**
 * Creates a new item category.
 */
export function useCreateItemCategory(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('item_categories', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS_CATEGORIES');
    },
    ...props,
  });
}

/**
 * Edits the item category.
 */
export function useEditItemCategory(props) {
  const queryClient = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`item_categories/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ITEMS_CATEGORIES');
        queryClient.invalidateQueries('ITEMS');
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

  return useMutation((id) => ApiService.delete(`item_categories/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('ITEMS_CATEGORIES');
      queryClient.invalidateQueries('ITEMS');
    },
    ...props,
  });
}

// Transforms items categories.
const transformItemsCategories = (response) => {
  return {
    itemsCategories: response.data.item_categories,
    pagination: response.data.pagination,
  };
};

/**
 * Retrieve the items categories.
 */
export function useItemsCategories(query, props) {
  const states = useQuery(
    ['ITEMS_CATEGORIES', query],
    () =>
      ApiService.get(`item_categories`, { params: query }).then(
        transformItemsCategories,
      ),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      itemsCategories: [],
      pagination: {},
    }),
  };
}

/**
 * Retrieve the item category details.
 * @param {number} id - Item category.
 */
export function useItemCategory(id, props) {
  const states = useQuery(
    ['ITEMS_CATEGORY', id],
    () =>
      ApiService.get(`item_categories/${id}`).then((res) => res.data.category),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}
