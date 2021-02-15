import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';

// Transform the account.
const transformAccount = (response) => {
  return response.data.account;
};

/**
 * Retrieve accounts list.
 */
export function useAccounts(query, props) {
  const states = useQuery(
    ['ACCOUNTS', query],
    () => ApiService.get('accounts', { params: query }),
    {
      select: (response) => {
        return response.data.accounts;
      },
      ...props,
    },
  );
  return {
    ...states,
    data: defaultTo(states.data, []),
  };
}

/**
 * Retrieve the given account details.
 * @param {number} id -
 */
export function useAccount(id, props) {
  const states = useQuery(
    ['ACCOUNT', id],
    () => ApiService.get(`accounts/${id}`).then(transformAccount),
    props,
  );
  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Retrieve accounts types list.
 */
export function useAccountsTypes(props) {
  const states = useQuery(
    ['ACCOUNTS_TYPES'],
    () => ApiService.get('account_types'),
    {
      select: (res) => res.data.account_types,
      ...props,
    },
  );
  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
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
    ...props,
  });
}

/**
 * Edits the given account.
 */
export function useEditAccount(props) {
  const query = useQueryClient();

  return useMutation(
    ([id,values]) => ApiService.post(`accounts/${id}`, values),
    {
      onSuccess: () => {
        query.invalidateQueries('ACCOUNTS');
      },
      ...props,
    },
  );
}

/**
 * Edits the given account.
 */
export function useDeleteAccount(props) {
  const query = useQueryClient();

  return useMutation((id) => ApiService.delete(`accounts/${id}`), {
    onSuccess: () => {
      query.invalidateQueries('ACCOUNTS');
    },
    ...props,
  });
}

/**
 * Actiavte the give account.
 */
export function useActivateAccount(props) {
  const query = useQueryClient();

  return useMutation((id) => ApiService.post(`accounts/${id}/activate`), {
    onSuccess: () => {
      query.invalidateQueries('ACCOUNTS');
    },
    ...props,
  });
}

/**
 * Inactivate the given account.
 */
export function useInactivateAccount(props) {
  const query = useQueryClient();

  return useMutation((id) => ApiService.post(`accounts/${id}/inactivate`), {
    onSuccess: () => {
      query.invalidateQueries('ACCOUNTS');
    },
    ...props,
  });
}
