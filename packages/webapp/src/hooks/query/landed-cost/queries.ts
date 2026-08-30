import {
  fetchLandedCostTransactions,
  allocateLandedCost,
  deleteAllocatedLandedCost,
  fetchBillLandedCostTransactions,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  type QueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { billsKeys } from '../bills/query-keys';
import { landedCostKeys } from './query-keys';
import type {
  BillLandedCostTransaction,
  BillLandedCostTransactionsResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: billsKeys.all() });
  queryClient.invalidateQueries({ queryKey: landedCostKeys.all() });
  queryClient.invalidateQueries({ queryKey: landedCostKeys.transactions() });
};

export function useCreateLandedCost(
  props?: UseMutationOptions<unknown, Error, [number, unknown]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, unknown]) =>
      allocateLandedCost(
        fetcher,
        id,
        values as Parameters<typeof allocateLandedCost>[2],
      ),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteLandedCost(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (landedCostId: number) =>
      deleteAllocatedLandedCost(fetcher, landedCostId),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useLandedCostTransaction(
  query: string | undefined,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: landedCostKeys.list({ query }),
    queryFn: () =>
      fetchLandedCostTransactions(fetcher, {
        transaction_type: query,
      } as Record<string, unknown>),
  });
}

export function useBillLocatedLandedCost(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<
      BillLandedCostTransactionsResponse,
      Error,
      BillLandedCostTransaction[]
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: landedCostKeys.transaction(id),
    queryFn: () => fetchBillLandedCostTransactions(fetcher, id!),
    select: (data) => data.data ?? [],
    enabled: id != null,
  });
}
