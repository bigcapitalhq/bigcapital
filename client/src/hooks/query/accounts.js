import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';

const transformAccount = (response) => {
  return response.data.account;
};

/**
 * Retrieve accounts list.
 */
export function useAccounts(query, props) {
  return useQuery(
    ['ACCOUNTS', query],
    () =>
      ApiService.get('accounts', { params: query }).then(
        (response) => response.data.accounts,
      ),
    {
      initialData: [],
      ...props
    },
  );
}

/**
 * Retrieve the given account details.
 * @param {number} id -
 */
export function useAccount(id, props) {
  return useQuery(
    ['ACCOUNT', id],
    () => ApiService.get(`accounts/${id}`).then(transformAccount),
    {
      initialData: {},
      ...props,
    },
  );
}

/**
 * Retrieve accounts types list.
 */
export function useAccountsTypes() {
  return useQuery(['ACCOUNTS_TYPES'], () => ApiService.get('account_types'), {
    initialData: [],
  });
}

/**
 * Creates account.
 */
export function useCreateAccount(props) {
  const client = useQueryClient();

  return useMutation((values) => ApiService.post('accounts', values), {
    onSuccess: () => {
      client.invalidateQueries('ACCOUNTS');
    },
    ...props
  });
}

/**
 * Edits the given account.
 */
export function useEditAccount(props) {
  const query = useQueryClient();

  return useMutation(
    (values, id) => ApiService.post(`accounts/${id}`, values),
    {
      onSuccess: () => {
        query.invalidateQueries('ACCOUNTS');
      },
      ...props
    },
  );
}

/**
 * Edits the given account.
 */
export function useDeleteAccount(props) {
  const query = useQueryClient();

  return useMutation(
    (id) =>
      ApiService.delete(`accounts/${id}`).catch((error) => {
        throw new Error(error.response.data);
      }),
    {
      onSuccess: () => {
        query.invalidateQueries('ACCOUNTS');
      },
      ...props,
    },
  );
}

/**
 * Actiavte the give account.
 */
export function useActivateAccount(props) {
  const query = useQueryClient();

  return useMutation(
    (id) => ApiService.post(`accounts/${id}/activate`),
    {
      onSuccess: () => {
        
      },
      ...props
    }
  );
}

/**
 * Inactivate the given account.
 */
export function useInactivateAccount(props) {
  const query = useQueryClient();

  return useMutation(
    (id) => ApiService.post(`accounts/${id}/inactivate`),
    {
      onSuccess: () => {
        
      },
      ...props
    },
  );
}
