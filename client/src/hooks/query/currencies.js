import { useMutation, useQueryClient, useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';

/**
 * Create a new currency.
 */
export function useCreateCurrency(props) {
  const queryClient = useQueryClient();

  return useMutation(
    (values) => ApiService.post('currencies', values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CURRENCIES');
      },
      ...props,
    }
  );
}

/**
 * Edits the given currency code.
 */
export function useEditCurrency(props) {
  const queryClient = useQueryClient();

  return useMutation((currencyCode, values) =>
    ApiService.post(`currencies/${currencyCode}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CURRENCIES');
      },
      ...props,
    }
  );
}

/**
 * Deletes the given currency.
 */
export function useDeleteCurrency(props) {
  const queryClient = useQueryClient();

  return useMutation((currencyCode) =>
    ApiService.delete(`currencies/${currencyCode}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CURRENCIES');
      },
      ...props
    }
  );
}

/**
 * Retrieve the currencies list.
 */
export function useCurrencies(props) {
  const states = useQuery(
    ['CURRENCIES'],
    () => ApiService.get('currencies').then(res => res.data.currencies),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  }
}
