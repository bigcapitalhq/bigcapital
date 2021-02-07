import { useMutation, useQuery } from 'react-query';
import ApiService from 'services/ApiService';

/**
 * Create a new currency.
 */
export function useCreateCurrency() {
  return useMutation((values) => ApiService.post('currencies', values));
}

/**
 * Edits the given currency code.
 */
export function useEditCurrency() {
  return useMutation((currencyCode, values) =>
    ApiService.post(`currencies/${currencyCode}`, values),
  );
}

/**
 * Deletes the given currency.
 */
export function useDeleteCurrency() {
  return useMutation((currencyCode) =>
    ApiService.delete(`currencies/${currencyCode}`),
  );
}

/**
 * Retrieve the currencies list.
 */
export function useCurrencies(props) {
  return useQuery(
    ['CURRENCIES'],
    () => ApiService.get('currencies').then(res => res.data.currencies),
    {
      initialData: [],
      ...props,
    },
  );
}
