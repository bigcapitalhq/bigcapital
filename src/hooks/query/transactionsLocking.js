import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import { useRequestPdf } from '../utils';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate customers.
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
 * Create cancle locking transactions
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
 * Create cancle unlocking partial transactions.
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
