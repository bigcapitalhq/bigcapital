import {
  createTrackingCategory,
  deleteTrackingCategory,
  editTrackingCategory,
  fetchTrackingCategories,
  fetchTrackingCategory,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { trackingCategoriesKeys } from './query-keys';
import type {
  CreateTrackingCategoryBody,
  EditTrackingCategoryBody,
  TrackingCategory,
  TrackingCategoriesList,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: trackingCategoriesKeys.all() });
};

/**
 * Retrieves all tracking categories.
 */
export function useTrackingCategories(
  props?: Omit<UseQueryOptions<TrackingCategoriesList>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: trackingCategoriesKeys.list(),
    queryFn: () => fetchTrackingCategories(fetcher),
  });
}

/**
 * Retrieves the given tracking category.
 */
export function useTrackingCategory(
  id: number | string | null | undefined,
  props?: Omit<UseQueryOptions<TrackingCategory>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: trackingCategoriesKeys.detail(id),
    queryFn: () => fetchTrackingCategory(fetcher, Number(id)),
    enabled: id != null && (props?.enabled ?? true),
  });
}

/**
 * Creates a new tracking category.
 */
export function useCreateTrackingCategory(
  props?: UseMutationOptions<
    TrackingCategory,
    Error,
    CreateTrackingCategoryBody
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateTrackingCategoryBody) =>
      createTrackingCategory(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

/**
 * Edits the given tracking category.
 */
export function useEditTrackingCategory(
  props?: UseMutationOptions<
    TrackingCategory,
    Error,
    [number | string, EditTrackingCategoryBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number | string, EditTrackingCategoryBody]) =>
      editTrackingCategory(fetcher, Number(id), values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({
        queryKey: trackingCategoriesKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

/**
 * Deletes the given tracking category.
 */
export function useDeleteTrackingCategory(
  props?: UseMutationOptions<void, Error, number | string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number | string) =>
      deleteTrackingCategory(fetcher, Number(id)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: trackingCategoriesKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}
