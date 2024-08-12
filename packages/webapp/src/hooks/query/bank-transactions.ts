// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';
import { BANK_QUERY_KEY } from '@/constants/query-keys/banking';
import t from './types';

type UncategorizeTransactionsBulkValues = { ids: Array<number> };
interface UncategorizeBankTransactionsBulkResponse {}

/**
 * Uncategorize the given categorized transactions in bulk.
 * @param {UseMutationResult<PuaseFeedsBankAccountResponse, Error, ExcludeBankTransactionValue>} options
 * @returns {UseMutationResult<PuaseFeedsBankAccountResponse, Error, ExcludeBankTransactionValue>}
 */
export function useUncategorizeTransactionsBulkAction(
  options?: UseMutationOptions<
    UncategorizeBankTransactionsBulkResponse,
    Error,
    UncategorizeTransactionsBulkValues
  >,
): UseMutationResult<
  UncategorizeBankTransactionsBulkResponse,
  Error,
  UncategorizeTransactionsBulkValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    UncategorizeBankTransactionsBulkResponse,
    Error,
    UncategorizeTransactionsBulkValues
  >(
    (value) =>
      apiRequest.post(`/cashflow/transactions/uncategorize/bulk`, {
        ids: value.ids,
      }),
    {
      onSuccess: (res, values) => {
        // Invalidate the account uncategorized transactions.
        queryClient.invalidateQueries(
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        );
        // Invalidate the account transactions.
        queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

        // Invalidate bank account summary.
        queryClient.invalidateQueries(BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META);

        // Invalidate the recognized transactions.
        queryClient.invalidateQueries([
          BANK_QUERY_KEY.RECOGNIZED_BANK_TRANSACTIONS_INFINITY,
        ]);
        // Invalidate the account.
        queryClient.invalidateQueries(t.ACCOUNT);
      },
      ...options,
    },
  );
}
