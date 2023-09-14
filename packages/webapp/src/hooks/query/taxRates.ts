// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import QUERY_TYPES from './types';
import useApiRequest from '../useRequest';

/**
 * Retrieves tax rates.
 * @param {number} customerId - Customer id.
 */
export function useTaxRates(props) {
  return useRequestQuery(
    [QUERY_TYPES.TAX_RATES],
    {
      method: 'get',
      url: `tax-rates`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieves tax rate.
 * @param {number} taxRateId - Tax rate id.
 */
export function useTaxRate(taxRateId: string, props) {
  return useRequestQuery(
    [QUERY_TYPES.TAX_RATES, taxRateId],
    {
      method: 'get',
      url: `tax-rates/${taxRateId}}`,
    },
    {
      select: (res) => res.data.data,
      ...props,
    },
  );
}

/**
 * Edit the given tax rate.
 */
export function useEditTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`tax-rates/${id}`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate specific item.
        queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
        queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES]);
      },
      ...props,
    },
  );
}

/**
 * Creates a new tax rate.
 */
export function useCreateTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([values]) => apiRequest.post('tax-rates', values), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES]);
    },
    ...props,
  });
}

/**
 * Deletes a new tax rate.
 */
export function useDeleteTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id]) => apiRequest.delete(`tax-rates/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES]);
    },
    ...props,
  });
}
