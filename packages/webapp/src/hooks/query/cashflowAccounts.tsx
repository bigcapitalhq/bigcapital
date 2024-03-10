// @ts-nocheck
import { useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_CASHFLOW]);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate account transactions.
  queryClient.invalidateQueries(t.ACCOUNT_TRANSACTION);

  // Invalidate cashflow accounts.
  queryClient.invalidateQueries(t.CASH_FLOW_ACCOUNTS);

  // Invalidate the cashflow transactions.
  queryClient.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
  queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
  queryClient.invalidateQueries(t.CASH_FLOW_TRANSACTION);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
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
 * Retrieve account transactions list.
 */
export function useCashflowTransaction(id, props) {
  return useRequestQuery(
    [t.CASH_FLOW_TRANSACTIONS, id],
    { method: 'get', url: `cashflow/transactions/${id}` },
    {
      select: (res) => res.data.cashflow_transaction,
      defaultData: [],
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
  infinityProps,
  axios,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    [t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY, accountId],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/financial_statements/cashflow-account-transactions`,
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

/**
 * Retrieve account transactions infinity scrolling.
 * @param {number} accountId
 * @param {*} axios
 * @returns
 */
export function useAccountUncategorizedTransactionsInfinity(
  accountId,
  query,
  infinityProps,
  axios,
) {
  const apiRequest = useApiRequest();

  return useInfiniteQuery(
    [t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY, accountId],
    async ({ pageParam = 1 }) => {
      const response = await apiRequest.http({
        ...axios,
        method: 'get',
        url: `/api/cashflow/transactions/${accountId}/uncategorized`,
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

/**
 * Refresh cashflow transactions infinity.
 */
export function useRefreshCashflowTransactionsInfinity() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);
    },
  };
}

/**
 * Refresh cashflow accounts.
 */
export function useRefreshCashflowAccounts() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.CASH_FLOW_ACCOUNTS);
    },
  };
}

/**
 * Refresh the cshflow account transactions.
 */
export function useRefreshCashflowTransactions() {
  const query = useQueryClient();

  return {
    refresh: () => {
      query.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
    },
  };
}

/**
 * Retrieves specific uncategorized transaction.
 * @param {number} uncategorizedTranasctionId -
 */
export function useUncategorizedTransaction(
  uncategorizedTranasctionId: nunber,
  props,
) {
  return useRequestQuery(
    [t.CASHFLOW_UNCAATEGORIZED_TRANSACTION, uncategorizedTranasctionId],
    {
      method: 'get',
      url: `cashflow/transactions/uncategorized/${uncategorizedTranasctionId}`,
    },
    {
      select: (res) => res.data?.data,
      ...props,
    },
  );
}

/**
 * Categorize the cashflow transaction.
 */
export function useCategorizeTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`cashflow/transactions/${id}/categorize`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
        commonInvalidateQueries(queryClient);
        queryClient.invalidateQueries(t.CASHFLOW_UNCAATEGORIZED_TRANSACTION);
        queryClient.invalidateQueries(
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        );
      },
      ...props,
    },
  );
}

/**
 * Uncategorize the cashflow transaction.
 */
export function useUncategorizeTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id: number) => apiRequest.post(`cashflow/transactions/${id}/uncategorize`),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
        commonInvalidateQueries(queryClient);
        queryClient.invalidateQueries(t.CASHFLOW_UNCAATEGORIZED_TRANSACTION);
        queryClient.invalidateQueries(
          t.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
        );
      },
      ...props,
    },
  );
}
