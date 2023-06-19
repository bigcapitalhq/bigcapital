// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import { useRequestPdf } from '../utils';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate.
  queryClient.invalidateQueries(t.TRANSACTION_LOCKING);
  queryClient.invalidateQueries(t.TRANSACTIONS_LOCKING);
};

/**
 * Create a locking transactions.
 */
export function useCreateLockingTransactoin(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.put('transactions-locking/lock', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Create cancel locking transactions
 */
export function useCancelLockingTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.put('transactions-locking/cancel-lock', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Create a unlocking partial transactions.
 */
export function useCreateUnlockingPartialTransactions(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();
  return useMutation(
    (values) => apiRequest.put('transactions-locking/unlock-partial', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Create cancel unlocking partial transactions.
 */
export function useCancelUnlockingPartialTransactions(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();
  return useMutation(
    (values) =>
      apiRequest.put('transactions-locking/cancel-unlock-partial', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the transactions locking.
 */
export function useTransactionsLocking(query, props) {
  return useRequestQuery(
    [t.TRANSACTIONS_LOCKING, query],
    { method: 'get', url: 'transactions-locking', params: query },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

export function useEditTransactionsLocking(query, props) {
  return useRequestQuery(
    [t.TRANSACTION_LOCKING, query],
    { method: 'get', url: `transactions-locking/${query}` },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}
