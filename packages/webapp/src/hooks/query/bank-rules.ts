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
import { BANK_QUERY_KEY } from '@/constants/query-keys/banking';

// Common cache invalidator.
const commonInvalidateQueries = (query: QueryClient) => {
  query.invalidateQueries(BANK_QUERY_KEY.BANK_RULES);
  query.invalidateQueries(BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY);
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

interface DisconnectBankAccountRes {}
interface DisconnectBankAccountValues {
  bankAccountId: number;
}

/**
 * Disconnects the given bank account.
 * @param {UseMutationOptions<DisconnectBankAccountRes, Error, DisconnectBankAccountValues>} options
 * @returns {UseMutationResult<DisconnectBankAccountRes, Error, DisconnectBankAccountValues>}
 */
export function useDisconnectBankAccount(
  options?: UseMutationOptions<
    DisconnectBankAccountRes,
    Error,
    DisconnectBankAccountValues
  >,
): UseMutationResult<
  DisconnectBankAccountRes,
  Error,
  DisconnectBankAccountValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    DisconnectBankAccountRes,
    Error,
    DisconnectBankAccountValues
  >(
    ({ bankAccountId }) =>
      apiRequest.post(`/banking/bank_accounts/${bankAccountId}/disconnect`),
    {
      ...options,
      onSuccess: (res, values) => {
        queryClient.invalidateQueries([t.ACCOUNT, values.bankAccountId]);
      },
    },
  );
}

interface UpdateBankAccountRes {}
interface UpdateBankAccountValues {
  bankAccountId: number;
}

/**
 * Update the bank transactions of the bank account.
 * @param {UseMutationOptions<UpdateBankAccountRes, Error, UpdateBankAccountValues>}
 * @returns {UseMutationResult<UpdateBankAccountRes, Error, UpdateBankAccountValues>}
 */
export function useUpdateBankAccount(
  options?: UseMutationOptions<
    UpdateBankAccountRes,
    Error,
    UpdateBankAccountValues
  >,
): UseMutationResult<UpdateBankAccountRes, Error, UpdateBankAccountValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<DisconnectBankAccountRes, Error, UpdateBankAccountValues>(
    ({ bankAccountId }) =>
      apiRequest.post(`/banking/bank_accounts/${bankAccountId}/update`),
    {
      ...options,
      onSuccess: () => {},
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
          BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY,
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
    [BANK_QUERY_KEY.BANK_RULES],
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
    [BANK_QUERY_KEY.BANK_RULES, bankRuleId],
    () =>
      apiRequest
        .get(`/banking/rules/${bankRuleId}`)
        .then((res) => res.data.bank_rule),
    { ...options },
  );
}

interface GetBankTransactionsMatchesValue {
  uncategorizeTransactionsIds: Array<number>;
}
interface GetBankTransactionsMatchesResponse {
  perfectMatches: Array<any>;
  possibleMatches: Array<any>;
  totalPending: number;
}

/**
 * Retrieves the bank transactions matches.
 * @param {UseQueryOptions<GetBankTransactionsMatchesResponse, Error>} params -
 * @returns {UseQueryResult<GetBankTransactionsMatchesResponse, Error>}
 */
export function useGetBankTransactionsMatches(
  uncategorizeTransactionsIds: Array<number>,
  options?: UseQueryOptions<GetBankTransactionsMatchesResponse, Error>,
): UseQueryResult<GetBankTransactionsMatchesResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetBankTransactionsMatchesResponse, Error>(
    [BANK_QUERY_KEY.BANK_TRANSACTION_MATCHES, uncategorizeTransactionsIds],
    () =>
      apiRequest
        .get(`/cashflow/transactions/matches`, {
          params: { uncategorizeTransactionsIds },
        })
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
}

const onValidateExcludeUncategorizedTransaction = (queryClient) => {
  // Invalidate queries.
  queryClient.invalidateQueries(
    BANK_QUERY_KEY.EXCLUDED_BANK_TRANSACTIONS_INFINITY,
  );
  queryClient.invalidateQueries(
    t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
  );
  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // invalidate bank account summary.
  queryClient.invalidateQueries(BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META);

  // Invalidate the recognized transactions.
  queryClient.invalidateQueries([
    BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY,
  ]);
};

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
        onValidateExcludeUncategorizedTransaction(queryClient);
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
        onValidateExcludeUncategorizedTransaction(queryClient);
      },
      ...options,
    },
  );
}

type ExcludeBankTransactionsValue = { ids: Array<number | string> };
interface ExcludeBankTransactionsResponse {}

/**
 * Excludes the uncategorized bank transactions in bulk.
 * @param {UseMutationResult<ExcludeBankTransactionsResponse, Error, ExcludeBankTransactionValue>} options
 * @returns {UseMutationResult<ExcludeBankTransactionsResponse, Error, ExcludeBankTransactionValue>}
 */
export function useExcludeUncategorizedTransactions(
  options?: UseMutationOptions<
    ExcludeBankTransactionsResponse,
    Error,
    ExcludeBankTransactionsValue
  >,
): UseMutationResult<
  ExcludeBankTransactionsResponse,
  Error,
  ExcludeBankTransactionsValue
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ExcludeBankTransactionsResponse,
    Error,
    ExcludeBankTransactionsValue
  >(
    (value: { ids: Array<number | string> }) =>
      apiRequest.put(`/cashflow/transactions/exclude`, { ids: value.ids }),
    {
      onSuccess: (res, id) => {
        onValidateExcludeUncategorizedTransaction(queryClient);
      },
      ...options,
    },
  );
}

type UnexcludeBankTransactionsValue = { ids: Array<number | string> };
interface UnexcludeBankTransactionsResponse {}

/**
 * Excludes the uncategorized bank transactions in bulk.
 * @param {UseMutationResult<UnexcludeBankTransactionsResponse, Error, ExcludeBankTransactionValue>} options
 * @returns {UseMutationResult<UnexcludeBankTransactionsResponse, Error, ExcludeBankTransactionValue>}
 */
export function useUnexcludeUncategorizedTransactions(
  options?: UseMutationOptions<
    UnexcludeBankTransactionsResponse,
    Error,
    UnexcludeBankTransactionsValue
  >,
): UseMutationResult<
  UnexcludeBankTransactionsResponse,
  Error,
  UnexcludeBankTransactionsValue
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    UnexcludeBankTransactionsResponse,
    Error,
    UnexcludeBankTransactionsValue
  >(
    (value: { ids: Array<number | string> }) =>
      apiRequest.put(`/cashflow/transactions/unexclude`, { ids: value.ids }),
    {
      onSuccess: (res, id) => {
        onValidateExcludeUncategorizedTransaction(queryClient);
      },
      ...options,
    },
  );
}

interface MatchUncategorizedTransactionValues {
  uncategorizedTransactions: Array<number>;
  matchedTransactions: Array<{ reference_type: string; reference_id: number }>;
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
  >((value) => apiRequest.post('/banking/matches/match', value), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries(
        t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
      );
      queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

      // Invalidate accounts.
      queryClient.invalidateQueries(t.ACCOUNTS);
      queryClient.invalidateQueries(t.ACCOUNT);

      // Invalidate bank account summary.
      queryClient.invalidateQueries(BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META);
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

      // Invalidate accounts.
      queryClient.invalidateQueries(t.ACCOUNTS);
      queryClient.invalidateQueries(t.ACCOUNT);

      // Invalidate bank account summary.
      queryClient.invalidateQueries(BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META);
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
    [BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTION, uncategorizedTransactionId],
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
    [BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META, bankAccountId],
    () =>
      apiRequest
        .get(`/banking/bank_accounts/${bankAccountId}/meta`)
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}

export interface GetAutofillCategorizeTransaction {
  accountId: number | null;
  amount: number;
  category: string | null;
  date: Date;
  formattedAmount: string;
  formattedDate: string;
  isRecognized: boolean;
  recognizedByRuleId: number | null;
  recognizedByRuleName: string | null;
  referenceNo: null | string;
  isDepositTransaction: boolean;
  isWithdrawalTransaction: boolean;
}

export function useGetAutofillCategorizeTransaction(
  uncategorizedTransactionIds: number[],
  options: any,
) {
  const apiRequest = useApiRequest();

  return useQuery<GetAutofillCategorizeTransaction, Error>(
    [
      BANK_QUERY_KEY.AUTOFILL_CATEGORIZE_BANK_TRANSACTION,
      uncategorizedTransactionIds,
    ],
    () =>
      apiRequest
        .get(`/banking/categorize/autofill`, {
          params: { uncategorizedTransactionIds },
        })
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
    [BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY, query],
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
    [BANK_QUERY_KEY.EXCLUDED_BANK_TRANSACTIONS_INFINITY, query],
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

export function usePendingBankTransactionsInfinity(
  query,
  infinityProps,
  axios,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    [BANK_QUERY_KEY.PENDING_BANK_ACCOUNT_TRANSACTIONS_INFINITY, query],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/banking/bank_accounts/pending_transactions`,
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
