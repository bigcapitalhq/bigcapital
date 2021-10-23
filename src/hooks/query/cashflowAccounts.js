import { useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);
  queryClient.invalidateQueries(t.CASH_FLOW_TRANSACTION);
};

/**
 * Retrieve accounts list.
 */
export function useCashflowAccounts(query, props) {
  return useRequestQuery(
    [t.CASH_FLOW_ACCOUNTS, query],
    { method: 'get', url: 'cashflow/accounts', params: query },
    {
      select: (res) => res.data.cashflow_accounts,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve account transactions list.
 */
export function useCashflowTransactions(id, props) {
  return useRequestQuery(
    [t.CASH_FLOW_TRANSACTIONS, id],
    { method: 'get', url: `cashflow/account/${id}/transactions` },
    {
      select: (res) => res.data.cashflow_transactions,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Create Money in owner contribution .
 */
export function useCreateCashflowTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('cashflow/transactions', values),
    {
      onSuccess: () => {
        // Invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteCashflowTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`cashflow/transactions/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries([t.CASH_FLOW_TRANSACTION, id]);

      // Invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve account transactions infinity scrolling.
 * @param {number} accountId
 * @param {*} axios
 * @returns
 */
export function useAccountTransactionsInfinity(
  accountId,
  query,
  axios,
  infinityProps,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    ['CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY', accountId],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/cashflow/account/${accountId}/transactions`,
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
