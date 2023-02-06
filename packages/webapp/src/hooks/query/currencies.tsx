// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

/**
 * Create a new currency.
 */
export function useCreateCurrency(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('currencies', values), {
    onSuccess: () => {
      // Invalidate currencies.
      queryClient.invalidateQueries(t.CURRENCIES);
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
        // Invalidate currencies.
        queryClient.invalidateQueries(t.CURRENCIES);
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
        // Invalidate currencies.
        queryClient.invalidateQueries(t.CURRENCIES);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the currencies list.
 */
export function useCurrencies(props) {
  return useRequestQuery(
    [t.CURRENCIES],
    { method: 'get', url: 'currencies' },
    {
      select: (res) => res.data.currencies,
      defaultData: [],
      ...props
    },
  );
}
