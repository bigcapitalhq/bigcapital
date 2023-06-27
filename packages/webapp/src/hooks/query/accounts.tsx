// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Transform the account.
const transformAccount = (response) => {
  return response.data.account;
};

const commonInvalidateQueries = (query) => {
  // Invalidate accounts.
  query.invalidateQueries(t.ACCOUNTS);
  query.invalidateQueries(t.ACCOUNT);

  // Invalidate cashflow accounts.
  query.invalidateQueries(t.CASH_FLOW_ACCOUNTS);

  // Invalidate financial reports.
  query.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Retrieve accounts list.
 */
export function useAccounts(query, props) {
  return useRequestQuery(
    [t.ACCOUNTS, query],
    { method: 'get', url: 'accounts', params: query },
    {
      select: (res) => res.data.accounts,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve the given account details.
 * @param {number} id - Account id.
 */
export function useAccount(id, props) {
  return useRequestQuery(
    [t.ACCOUNT, id],
    { method: 'get', url: `accounts/${id}` },
    {
      select: transformAccount,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve accounts types list.
 */
export function useAccountsTypes(props) {
  return useRequestQuery(
    [t.ACCOUNTS_TYPES],
    { method: 'get', url: 'account_types' },
    {
      select: (res) => res.data.account_types,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Creates account.
 */
export function useCreateAccount(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('accounts', values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(client);
    },
    ...props,
  });
}

/**
 * Edits the given account.
 */
export function useEditAccount(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`accounts/${id}`, values),
    {
      onSuccess: () => {
        // Common invalidate queries.
        commonInvalidateQueries(client);
      },
      ...props,
    },
  );
}

/**
 * Edits the given account.
 */
export function useDeleteAccount(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`accounts/${id}`), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(client);
    },
    ...props,
  });
}

/**
 * Activate the give account.
 */
export function useActivateAccount(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`accounts/${id}/activate`), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(client);
    },
    ...props,
  });
}

/**
 * Inactivate the given account.
 */
export function useInactivateAccount(props) {
  const query = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`accounts/${id}/inactivate`), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(query);
    },
    ...props,
  });
}

/**
 * Retrieve account transactions.
 */
export function useAccountTransactions(id, props) {
  return useRequestQuery(
    [t.ACCOUNT_TRANSACTION, id],
    { method: 'get', url: `accounts/transactions?account_id=${id}` },
    {
      select: (res) => res.data.transactions,
      defaultData: [],
      ...props,
    },
  );
}

export function useRefreshAccounts() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.ACCOUNTS);
    },
  };
}
