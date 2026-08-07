import {
  fetchTransactionsLocking,
  fetchTransactionsLockingByModule,
  lockTransactions,
  cancelLockTransactions,
  unlockPartialTransactions,
  cancelUnlockPartialTransactions,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { transactionsLockingKeys } from './query-keys';
import type { TransactionsLockingListResponse } from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: transactionsLockingKeys.all() });
};

export function useCreateLockingTransactoin(
  props?: UseMutationOptions<void, Error, Record<string, unknown>>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: Record<string, unknown>) =>
      lockTransactions(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useCancelLockingTransaction(
  props?: UseMutationOptions<void, Error, Record<string, unknown>>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: Record<string, unknown>) =>
      cancelLockTransactions(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useCreateUnlockingPartialTransactions(
  props?: UseMutationOptions<void, Error, Record<string, unknown>>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: Record<string, unknown>) =>
      unlockPartialTransactions(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useCancelUnlockingPartialTransactions(
  props?: UseMutationOptions<void, Error, Record<string, unknown>>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: Record<string, unknown>) =>
      cancelUnlockPartialTransactions(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useTransactionsLocking(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<TransactionsLockingListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: transactionsLockingKeys.list(query),
    queryFn: () => fetchTransactionsLocking(fetcher),
    select: (data) =>
      Array.isArray(data) ? data : ((data as { data?: unknown })?.data ?? data),
  });
}

export function useEditTransactionsLocking(
  query: string,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: transactionsLockingKeys.detail(query),
    queryFn: () => fetchTransactionsLockingByModule(fetcher, query),
    enabled: !!query,
  });
}
