// @ts-nocheck
import {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';
import t from './types';

const QUERY_KEY = {
  BANK_RULES: 'BANK_RULE',
  BANK_TRANSACTION_MATCHES: 'BANK_TRANSACTION_MATCHES',
  RECOGNIZED_BANK_TRANSACTION: 'RECOGNIZED_BANK_TRANSACTION',
  EXCLUDED_BANK_TRANSACTIONS_INFINITY: 'EXCLUDED_BANK_TRANSACTIONS_INFINITY',
  RECOGNIZED_BANK_TRANSACTIONS_INFINITY:
    'RECOGNIZED_BANK_TRANSACTIONS_INFINITY',
  BANK_ACCOUNT_SUMMARY_META: 'BANK_ACCOUNT_SUMMARY_META',
};

const commonInvalidateQueries = (query: QueryClient) => {
  query.invalidateQueries(QUERY_KEY.BANK_RULES);
  query.invalidateQueries(QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY);
};

interface CreateBankRuleValues {
  value: any;
}
interface CreateBankRuleResponse {}

/**
 * Creates a new bank rule.
 * @param {UseMutationOptions<CreateBankRuleValues, Error, CreateBankRuleValues>} options -
 * @returns {UseMutationResult<CreateBankRuleValues, Error, CreateBankRuleValues>}TCHES
 */
export function useCreateBankRule(
  options?: UseMutationOptions<
    CreateBankRuleValues,
    Error,
    CreateBankRuleValues
  >,
): UseMutationResult<CreateBankRuleValues, Error, CreateBankRuleValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<CreateBankRuleValues, Error, CreateBankRuleValues>(
    (values) =>
      apiRequest.post(`/banking/rules`, values).then((res) => res.data),
    {
      ...options,
      onSuccess: () => {
        commonInvalidateQueries(queryClient);
      },
    },
  );
}

interface EditBankRuleValues {
  id: number;
  value: any;
}
interface EditBankRuleResponse {}

/**
 * Edits the given bank rule.
 * @param {UseMutationOptions<EditBankRuleResponse, Error, EditBankRuleValues>} options -
 * @returns
 */
export function useEditBankRule(
  options?: UseMutationOptions<EditBankRuleResponse, Error, EditBankRuleValues>,
): UseMutationResult<EditBankRuleResponse, Error, EditBankRuleValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<EditBankRuleResponse, Error, EditBankRuleValues>(
    ({ id, value }) => apiRequest.post(`/banking/rules/${id}`, value),
    {
      ...options,
      onSuccess: () => {
        commonInvalidateQueries(queryClient);
      },
    },
  );
}

interface DeleteBankRuleResponse {}
type DeleteBankRuleValue = number;

/**
 * Deletes the given bank rule.
 * @param {UseMutationOptions<DeleteBankRuleResponse, Error, DeleteBankRuleValue>} options
 * @returns {UseMutationResult<DeleteBankRuleResponse, Error, DeleteBankRuleValue}
 */
export function useDeleteBankRule(
  options?: UseMutationOptions<
    DeleteBankRuleResponse,
    Error,
    DeleteBankRuleValue
  >,
): UseMutationResult<DeleteBankRuleResponse, Error, DeleteBankRuleValue> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id: number) => apiRequest.delete(`/banking/rules/${id}`),
    {
      onSuccess: (res, id) => {
        commonInvalidateQueries(queryClient);

        queryClient.invalidateQueries(
          QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY,
        );
        queryClient.invalidateQueries([
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        ]);
      },
      ...options,
    },
  );
}

interface BankRulesResponse {}

/**
 * Retrieves all bank rules.
 * @param {UseQueryOptions<BankRulesResponse, Error>} params -
 * @returns {UseQueryResult<BankRulesResponse, Error>}
 */
export function useBankRules(
  options?: UseQueryOptions<BankRulesResponse, Error>,
): UseQueryResult<BankRulesResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<BankRulesResponse, Error>(
    [QUERY_KEY.BANK_RULES],
    () => apiRequest.get('/banking/rules').then((res) => res.data.bank_rules),
    { ...options },
  );
}

interface GetBankRuleRes {}

/**
 * Retrieve the given bank rule.
 * @param {number} bankRuleId -
 * @param {UseQueryOptions<GetBankRuleRes, Error>} options -
 * @returns {UseQueryResult<GetBankRuleRes, Error>}
 */
export function useBankRule(
  bankRuleId: number,
  options?: UseQueryOptions<GetBankRuleRes, Error>,
): UseQueryResult<GetBankRuleRes, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetBankRuleRes, Error>(
    [QUERY_KEY.BANK_RULES, bankRuleId],
    () =>
      apiRequest
        .get(`/banking/rules/${bankRuleId}`)
        .then((res) => res.data.bank_rule),
    { ...options },
  );
}

type GetBankTransactionsMatchesValue = number;
interface GetBankTransactionsMatchesResponse {
  perfectMatches: Array<any>;
  possibleMatches: Array<any>;
}

/**
 * Retrieves the bank transactions matches.
 * @param {UseQueryOptions<GetBankTransactionsMatchesResponse, Error>} params -
 * @returns {UseQueryResult<GetBankTransactionsMatchesResponse, Error>}
 */
export function useGetBankTransactionsMatches(
  uncategorizedTransactionId: number,
  options?: UseQueryOptions<GetBankTransactionsMatchesResponse, Error>,
): UseQueryResult<GetBankTransactionsMatchesResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetBankTransactionsMatchesResponse, Error>(
    [QUERY_KEY.BANK_TRANSACTION_MATCHES, uncategorizedTransactionId],
    () =>
      apiRequest
        .get(`/cashflow/transactions/${uncategorizedTransactionId}/matches`)
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
}

type ExcludeUncategorizedTransactionValue = number;

interface ExcludeUncategorizedTransactionRes {}
/**
 * Excludes the given uncategorized transaction.
 * @param {UseMutationOptions<ExcludeUncategorizedTransactionRes, Error, ExcludeUncategorizedTransactionValue>}
 * @returns {UseMutationResult<ExcludeUncategorizedTransactionRes, Error, ExcludeUncategorizedTransactionValue> }
 */
export function useExcludeUncategorizedTransaction(
  options?: UseMutationOptions<
    ExcludeUncategorizedTransactionRes,
    Error,
    ExcludeUncategorizedTransactionValue
  >,
): UseMutationResult<
  ExcludeUncategorizedTransactionRes,
  Error,
  ExcludeUncategorizedTransactionValue
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ExcludeUncategorizedTransactionRes,
    Error,
    ExcludeUncategorizedTransactionValue
  >(
    (uncategorizedTransactionId: number) =>
      apiRequest.put(
        `/cashflow/transactions/${uncategorizedTransactionId}/exclude`,
      ),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
        queryClient.invalidateQueries(
          QUERY_KEY.EXCLUDED_BANK_TRANSACTIONS_INFINITY,
        );
        queryClient.invalidateQueries(
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        );
      },
      ...options,
    },
  );
}

type ExcludeBankTransactionValue = number;

interface ExcludeBankTransactionResponse {}

/**
 * Excludes the uncategorized bank transaction.
 * @param {UseMutationResult<ExcludeBankTransactionResponse, Error, ExcludeBankTransactionValue>} options
 * @returns {UseMutationResult<ExcludeBankTransactionResponse, Error, ExcludeBankTransactionValue>}
 */
export function useUnexcludeUncategorizedTransaction(
  options?: UseMutationOptions<
    ExcludeBankTransactionResponse,
    Error,
    ExcludeBankTransactionValue
  >,
): UseMutationResult<
  ExcludeBankTransactionResponse,
  Error,
  ExcludeBankTransactionValue
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ExcludeBankTransactionResponse,
    Error,
    ExcludeBankTransactionValue
  >(
    (uncategorizedTransactionId: number) =>
      apiRequest.put(
        `/cashflow/transactions/${uncategorizedTransactionId}/unexclude`,
      ),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
        queryClient.invalidateQueries(
          QUERY_KEY.EXCLUDED_BANK_TRANSACTIONS_INFINITY,
        );
        queryClient.invalidateQueries(
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        );
      },
      ...options,
    },
  );
}

interface MatchUncategorizedTransactionValues {
  id: number;
  value: any;
}
interface MatchUncategorizedTransactionRes {}

/**
 * Matchess the given uncateogrized transaction.
 * @param props
 * @returns
 */
export function useMatchUncategorizedTransaction(
  props?: UseMutationOptions<
    MatchUncategorizedTransactionRes,
    Error,
    MatchUncategorizedTransactionValues
  >,
): UseMutationResult<
  MatchUncategorizedTransactionRes,
  Error,
  MatchUncategorizedTransactionValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    MatchUncategorizedTransactionRes,
    Error,
    MatchUncategorizedTransactionValues
  >(({ id, value }) => apiRequest.post(`/banking/matches/${id}`, value), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries(
        t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
      );
      queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);
    },
    ...props,
  });
}

interface UnmatchUncategorizedTransactionValues {
  id: number;
}
interface UnmatchUncategorizedTransactionRes {}

/**
 * Unmatch the given matched uncategorized transaction.
 * @param {UseMutationOptions<UnmatchUncategorizedTransactionRes, Error, UnmatchUncategorizedTransactionValues>} props
 * @returns {UseMutationResult<UnmatchUncategorizedTransactionRes, Error, UnmatchUncategorizedTransactionValues>}
 */
export function useUnmatchMatchedUncategorizedTransaction(
  props?: UseMutationOptions<
    UnmatchUncategorizedTransactionRes,
    Error,
    UnmatchUncategorizedTransactionValues
  >,
): UseMutationResult<
  UnmatchUncategorizedTransactionRes,
  Error,
  UnmatchUncategorizedTransactionValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    UnmatchUncategorizedTransactionRes,
    Error,
    UnmatchUncategorizedTransactionValues
  >(({ id }) => apiRequest.post(`/banking/matches/unmatch/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries(
        t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
      );
      queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);
    },
    ...props,
  });
}

interface GetRecognizedBankTransactionRes {}

/**
 * REtrieves the given recognized bank transaction.
 * @param {number} uncategorizedTransactionId
 * @param {UseQueryOptions<GetRecognizedBankTransactionRes, Error>} options
 * @returns {UseQueryResult<GetRecognizedBankTransactionRes, Error>}
 */
export function useGetRecognizedBankTransaction(
  uncategorizedTransactionId: number,
  options?: UseQueryOptions<GetRecognizedBankTransactionRes, Error>,
): UseQueryResult<GetRecognizedBankTransactionRes, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetRecognizedBankTransactionRes, Error>(
    [QUERY_KEY.RECOGNIZED_BANK_TRANSACTION, uncategorizedTransactionId],
    () =>
      apiRequest
        .get(`/banking/recognized/transactions/${uncategorizedTransactionId}`)
        .then((res) => transformToCamelCase(res.data?.data)),
    options,
  );
}

interface GetBankAccountSummaryMetaRes {
  name: string;
  totalUncategorizedTransactions: number;
  totalRecognizedTransactions: number;
}

/**
 * Get the given bank account meta summary.
 * @param {number} bankAccountId
 * @param {UseQueryOptions<GetBankAccountSummaryMetaRes, Error>} options
 * @returns {UseQueryResult<GetBankAccountSummaryMetaRes, Error>}
 */
export function useGetBankAccountSummaryMeta(
  bankAccountId: number,
  options?: UseQueryOptions<GetBankAccountSummaryMetaRes, Error>,
): UseQueryResult<GetBankAccountSummaryMetaRes, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetBankAccountSummaryMetaRes, Error>(
    [QUERY_KEY.BANK_ACCOUNT_SUMMARY_META, bankAccountId],
    () =>
      apiRequest
        .get(`/banking/bank_accounts/${bankAccountId}/meta`)
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}

/**
 * @returns
 */
export function useRecognizedBankTransactionsInfinity(
  query,
  infinityProps,
  axios,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    [QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY, query],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/banking/recognized`,
        params: { page: pageParam, ...query },
      });
      return response.data;
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.pagination.page - 1,
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;

        return pagination.total > pagination.page_size * pagination.page
          ? lastPage.pagination.page + 1
          : undefined;
      },
      ...infinityProps,
    },
  );
}

export function useExcludedBankTransactionsInfinity(
  query,
  infinityProps,
  axios,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    [QUERY_KEY.EXCLUDED_BANK_TRANSACTIONS_INFINITY, query],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/cashflow/excluded`,
        params: { page: pageParam, ...query },
      });
      return response.data;
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.pagination.page - 1,
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;

        return pagination.total > pagination.page_size * pagination.page
          ? lastPage.pagination.page + 1
          : undefined;
      },
      ...infinityProps,
    },
  );
}
