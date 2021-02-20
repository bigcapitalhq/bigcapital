import { useMutation, useQueryClient, useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';

/**
 * Create a new currency.
 */
export function useCreateCurrency(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('currencies', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('CURRENCIES');
    },
    ...props,
  });
}

/**
 * Edits the given currency code.
 */
export function useEditCurrency(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([currencyCode, values]) =>
      apiRequest.post(`currencies/${currencyCode}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CURRENCIES');
      },
      ...props,
    },
  );
}

/**
 * Deletes the given currency.
 */
export function useDeleteCurrency(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (currencyCode) => apiRequest.delete(`currencies/${currencyCode}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CURRENCIES');
      },
      ...props,
    },
  );
}

/**
 * Retrieve the currencies list.
 */
export function useCurrencies(props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['CURRENCIES'],
    () => apiRequest.get('currencies').then((res) => res.data.currencies),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  };
}
