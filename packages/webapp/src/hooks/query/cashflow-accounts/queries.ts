import {
  fetchCashflowAccounts,
  createCashflowTransaction,
  fetchCashflowTransaction,
  deleteCashflowTransaction,
  fetchAccountTransactionsInfinity,
  fetchAccountUncategorizedTransactions,
  fetchUncategorizedTransaction,
  categorizeTransaction,
  uncategorizeTransaction,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { accountsKeys } from '../accounts/query-keys';
import { customersKeys } from '../customers/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { vendorsKeys } from '../vendors/query-keys';
import { cashflowAccountsKeys } from './query-keys';
import type {
  BankingAccountsListResponse,
  BankingTransactionResponse,
  CreateCashflowTransactionBody,
  CashflowAccountTransactionsQuery,
  CashflowAccountUncategorizedTransactionsQuery,
  GetBankingAccountsQuery,
  CategorizeTransactionBody,
  UncategorizedTransactionResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  // Invalidate cashflow accounts.
  queryClient.invalidateQueries({ queryKey: cashflowAccountsKeys.all() });

  // Invalidate cashflow transactions.
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactions(),
  });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity(),
  });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.uncategorizedInfinity(),
  });

  // Invalidate accounts.
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: accountsKeys.transactions(null).slice(0, 1),
  });

  // Invalidate financial reports.
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });

  // Invalidate customers.
  queryClient.invalidateQueries({ queryKey: customersKeys.all() });

  // Invalidate vendors.
  queryClient.invalidateQueries({ queryKey: vendorsKeys.all() });
};

export function useCashflowAccounts(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<
      BankingAccountsListResponse,
      Error,
      BankingAccountsListResponse
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery<
    BankingAccountsListResponse,
    Error,
    BankingAccountsListResponse
  >({
    ...props,
    queryKey: cashflowAccountsKeys.list(query),
    queryFn: () =>
      fetchCashflowAccounts(fetcher, query as GetBankingAccountsQuery),
  });
}

export function useCreateCashflowTransaction(
  props?: UseMutationOptions<void, Error, CreateCashflowTransactionBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateCashflowTransactionBody) =>
      createCashflowTransaction(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useCashflowTransaction(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<
      BankingTransactionResponse,
      Error,
      BankingTransactionResponse
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();

  return useQuery<
    BankingTransactionResponse,
    Error,
    BankingTransactionResponse
  >({
    ...props,
    queryKey: cashflowAccountsKeys.transaction(id),
    queryFn: () => fetchCashflowTransaction(fetcher, id!),
    enabled: id != null,
  });
}

export function useDeleteCashflowTransaction(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteCashflowTransaction(fetcher, id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.transaction(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

type AccountTransactionsInfinityPage = Awaited<
  ReturnType<typeof fetchAccountTransactionsInfinity>
>;
type AccountUncategorizedTransactionsInfinityPage = Awaited<
  ReturnType<typeof fetchAccountUncategorizedTransactions>
> & { pagination?: { nextPage?: number } };

export function useAccountTransactionsInfinity(
  accountId: number,
  query?: CashflowAccountTransactionsQuery,
  props?: Omit<
    UseInfiniteQueryOptions<
      AccountTransactionsInfinityPage,
      Error,
      InfiniteData<AccountTransactionsInfinityPage, number>,
      QueryKey,
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useInfiniteQuery<
    AccountTransactionsInfinityPage,
    Error,
    InfiniteData<AccountTransactionsInfinityPage, number>,
    QueryKey,
    number
  >({
    ...props,
    queryKey: cashflowAccountsKeys.transactionsInfinity(accountId, query),
    queryFn: ({ pageParam }) =>
      fetchAccountTransactionsInfinity(fetcher, accountId, {
        ...query,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage,
  });
}

export function useAccountUncategorizedTransactionsInfinity(
  accountId: number,
  query?: CashflowAccountUncategorizedTransactionsQuery,
  props?: Omit<
    UseInfiniteQueryOptions<
      AccountUncategorizedTransactionsInfinityPage,
      Error,
      InfiniteData<AccountUncategorizedTransactionsInfinityPage, number>,
      QueryKey,
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useInfiniteQuery<
    AccountUncategorizedTransactionsInfinityPage,
    Error,
    InfiniteData<AccountUncategorizedTransactionsInfinityPage, number>,
    QueryKey,
    number
  >({
    ...props,
    queryKey: cashflowAccountsKeys.uncategorizedInfinity(accountId, query),
    queryFn: ({ pageParam }) =>
      fetchAccountUncategorizedTransactions(fetcher, accountId, {
        ...query,
        page: pageParam,
      }) as Promise<AccountUncategorizedTransactionsInfinityPage>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage,
  });
}

export function useRefreshCashflowAccounts() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: cashflowAccountsKeys.all() });
    },
  };
}

export function useRefreshCashflowTransactions() {
  const queryClient = useQueryClient();
  return {
    refresh: () => {
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.transactions(),
      });
    },
  };
}

export function useUncategorizedTransaction(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<
      UncategorizedTransactionResponse,
      Error,
      UncategorizedTransactionResponse
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery<
    UncategorizedTransactionResponse,
    Error,
    UncategorizedTransactionResponse
  >({
    ...props,
    queryKey: cashflowAccountsKeys.uncategorizedTransaction(id),
    queryFn: () => fetchUncategorizedTransaction(fetcher, id!),
    enabled: id != null,
  });
}

export function useCategorizeTransaction(
  props?: UseMutationOptions<
    void,
    Error,
    { id: number; values: CategorizeTransactionBody }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CategorizeTransactionBody;
    }) => categorizeTransaction(fetcher, id, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useUncategorizeTransaction(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => uncategorizeTransaction(fetcher, id),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}
