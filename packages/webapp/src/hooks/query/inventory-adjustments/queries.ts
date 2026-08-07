import {
  createQuickInventoryAdjustment,
  deleteInventoryAdjustment,
  publishInventoryAdjustment,
  fetchInventoryAdjustments,
  fetchInventoryAdjustment,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { inventoryAdjustmentsKeys } from './query-keys';
import type {
  InventoryAdjustment,
  InventoryAdjustmentsListResponse,
  CreateQuickInventoryAdjustmentBody,
  GetInventoryAdjustmentsQuery,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: inventoryAdjustmentsKeys.all() });
};

export function useCreateInventoryAdjustment(
  props?: UseMutationOptions<void, Error, CreateQuickInventoryAdjustmentBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateQuickInventoryAdjustmentBody) =>
      createQuickInventoryAdjustment(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteInventoryAdjustment(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteInventoryAdjustment(fetcher, id),
    onSuccess: (_res, _id) => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInventoryAdjustments(
  query?: GetInventoryAdjustmentsQuery | null,
  props?: Omit<
    UseQueryOptions<InventoryAdjustmentsListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: inventoryAdjustmentsKeys.list(query ?? undefined),
    queryFn: () => fetchInventoryAdjustments(fetcher, query ?? {}),
  });
}

export function usePublishInventoryAdjustment(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => publishInventoryAdjustment(fetcher, id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({
        queryKey: inventoryAdjustmentsKeys.detail(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInventoryAdjustment(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<InventoryAdjustment>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: inventoryAdjustmentsKeys.detail(id),
    queryFn: () => fetchInventoryAdjustment(fetcher, id!),
    enabled: id != null,
  });
}
