import {
  excludeBankTransaction,
  excludeBankTransactionsBulk,
  fetchMatchedTransactions,
  matchTransaction,
  uncategorizeTransactionsBulk,
  unexcludeBankTransaction,
  unexcludeBankTransactionsBulk,
  unmatchMatchedTransaction,
} from '@bigcapital/sdk-ts';
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../../useRequest';
import { bankingKeys } from '../query-keys';
import type {
  ExcludeBankTransactionsBulkBody,
  MatchTransactionBody,
  MatchedTransactionsResponse,
  UnmatchMatchedTransactionParams,
} from '@bigcapital/sdk-ts';
import type { QueryClient } from '@tanstack/react-query';

export function useGetBankTransactionsMatches(
  uncategorizedTransactionIds: number[],
  options?: UseQueryOptions<MatchedTransactionsResponse, Error>,
): UseQueryResult<MatchedTransactionsResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: bankingKeys.transactionMatches(uncategorizedTransactionIds),
    queryFn: () =>
      fetchMatchedTransactions(fetcher, uncategorizedTransactionIds),
  });
}

const onValidateExcludeUncategorizedTransaction = (
  queryClient: QueryClient,
) => {
  queryClient.invalidateQueries({
    queryKey: bankingKeys.excludedTransactionsInfinity(),
  });
  queryClient.invalidateQueries({
    queryKey: bankingKeys.summaryMeta(),
  });
  queryClient.invalidateQueries({
    queryKey: bankingKeys.recognizedTransactionsInfinity(),
  });
};

export function useExcludeUncategorizedTransaction(
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (uncategorizedTransactionId: number) =>
      excludeBankTransaction(fetcher, uncategorizedTransactionId),
    onSuccess: () => onValidateExcludeUncategorizedTransaction(queryClient),
  });
}

export function useUnexcludeUncategorizedTransaction(
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (uncategorizedTransactionId: number) =>
      unexcludeBankTransaction(fetcher, uncategorizedTransactionId),
    onSuccess: () => onValidateExcludeUncategorizedTransaction(queryClient),
  });
}

export function useExcludeUncategorizedTransactions(
  options?: UseMutationOptions<void, Error, ExcludeBankTransactionsBulkBody>,
): UseMutationResult<void, Error, ExcludeBankTransactionsBulkBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (value: ExcludeBankTransactionsBulkBody) =>
      excludeBankTransactionsBulk(fetcher, value),
    onSuccess: () => onValidateExcludeUncategorizedTransaction(queryClient),
  });
}

export function useUnexcludeUncategorizedTransactions(
  options?: UseMutationOptions<void, Error, ExcludeBankTransactionsBulkBody>,
): UseMutationResult<void, Error, ExcludeBankTransactionsBulkBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (value: ExcludeBankTransactionsBulkBody) =>
      unexcludeBankTransactionsBulk(fetcher, value),
    onSuccess: () => onValidateExcludeUncategorizedTransaction(queryClient),
  });
}

export function useMatchUncategorizedTransaction(
  props?: UseMutationOptions<void, Error, MatchTransactionBody>,
): UseMutationResult<void, Error, MatchTransactionBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (value: MatchTransactionBody) =>
      matchTransaction(fetcher, value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(),
      });
    },
  });
}

/** Mutation variables (UI uses id; API path param is uncategorizedTransactionId). */
type UnmatchUncategorizedTransactionValues = {
  id: UnmatchMatchedTransactionParams['uncategorizedTransactionId'];
};

export function useUnmatchMatchedUncategorizedTransaction(
  props?: UseMutationOptions<
    void,
    Error,
    UnmatchUncategorizedTransactionValues
  >,
): UseMutationResult<void, Error, UnmatchUncategorizedTransactionValues> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({ id }: UnmatchUncategorizedTransactionValues) =>
      unmatchMatchedTransaction(fetcher, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(),
      });
    },
  });
}

export type UncategorizeTransactionsBulkValues = { ids: number[] };

/**
 * Uncategorize the given categorized bank transactions in bulk (via DELETE /api/banking/categorize/bulk).
 */
export function useUncategorizeTransactionsBulkAction(
  options?: UseMutationOptions<void, Error, UncategorizeTransactionsBulkValues>,
): UseMutationResult<void, Error, UncategorizeTransactionsBulkValues> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: UncategorizeTransactionsBulkValues) =>
      uncategorizeTransactionsBulk(fetcher, values.ids),
    onSuccess: (_res, _values) => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(),
      });
      queryClient.invalidateQueries({
        queryKey: bankingKeys.recognizedTransactionsInfinity(),
      });
    },
    ...options,
  });
}
