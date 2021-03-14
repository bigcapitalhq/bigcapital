import { useMutation, useQuery, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import t from './types';

// Transform the account.
const transformAccount = (response) => {
  return response.data.account;
};

const commonInvalidateQueries = (query) => {
  // Invalidate accounts.
  query.invalidateQueries(t.ACCOUNTS);

  // Invalidate financial reports.
  query.invalidateQueries(t.FINANCIAL_REPORT);
}

/**
 * Retrieve accounts list.
 */
export function useAccounts(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.ACCOUNTS, query],
    () => apiRequest.get('accounts', { params: query }),
    {
      select: (response) => {
        return response.data.accounts;
      },
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          accounts: []
        },
      },
      ...props,
    },
  );
}

/**
 * Retrieve the given account details.
 * @param {number} id - Account id.
 */
export function useAccount(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.ACCOUNT, id],
    () => apiRequest.get(`accounts/${id}`).then(transformAccount),
    {
      initialDataUpdatedAt: 0,
      initialData: {
        data: { account: {} }
      },
      ...props
    },
  );
}

/**
 * Retrieve accounts types list.
 */
export function useAccountsTypes(props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.ACCOUNTS_TYPES],
    () => apiRequest.get('account_types'),
    {
      select: (res) => res.data.account_types,
      initialData: {
        data: {
          account_types: [],
        },
      },
      initialDataUpdatedAt: 0,
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
 * Actiavte the give account.
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
