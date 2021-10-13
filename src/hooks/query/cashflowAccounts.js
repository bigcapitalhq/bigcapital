import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // queryClient.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
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
    { method: 'get', url: `cashflow/account/${1000}/transactions` },
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
