import {
  fetchItemCategories,
  fetchItemCategory,
  createItemCategory,
  editItemCategory,
  deleteItemCategory,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { itemsCategoriesKeys } from './query-keys';
import type {
  ItemCategory,
  ItemCategoriesListResponse,
  CreateItemCategoryBody,
  EditItemCategoryBody,
  GetItemCategoriesQuery,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: itemsCategoriesKeys.all() });
};

export function useCreateItemCategory(
  props?: UseMutationOptions<void, Error, CreateItemCategoryBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateItemCategoryBody) =>
      createItemCategory(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditItemCategory(
  props?: UseMutationOptions<void, Error, [number, EditItemCategoryBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditItemCategoryBody]) =>
      editItemCategory(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({
        queryKey: itemsCategoriesKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteItemCategory(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteItemCategory(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: itemsCategoriesKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useItemsCategories(
  query?: GetItemCategoriesQuery,
  props?: Omit<
    UseQueryOptions<
      ItemCategoriesListResponse,
      Error,
      ItemCategoriesListResponse
    >,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery<
    ItemCategoriesListResponse,
    Error,
    ItemCategoriesListResponse
  >({
    ...props,
    queryKey: [...itemsCategoriesKeys.all(), query],
    queryFn: () => fetchItemCategories(fetcher, query),
  });
}

export function useItemCategory(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<ItemCategory>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: itemsCategoriesKeys.detail(id),
    queryFn: () => fetchItemCategory(fetcher, id!),
    enabled: id != null,
  });
}
