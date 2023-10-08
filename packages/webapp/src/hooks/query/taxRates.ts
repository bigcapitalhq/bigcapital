// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import QUERY_TYPES from './types';
import useApiRequest from '../useRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  queryClient.invalidateQueries(QUERY_TYPES.TAX_RATES);
};

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
        commonInvalidateQueries(queryClient);
        queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
        queryClient.invalidateQueries(QUERY_TYPES.ITEM);
        queryClient.invalidateQueries(QUERY_TYPES.ITEMS);
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

  return useMutation((values) => apiRequest.post('tax-rates', values), {
    onSuccess: (res, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
    },
    ...props,
  });
}

/**
 * Delete the given tax rate.
 */
export function useDeleteTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`tax-rates/${id}`), {
    onSuccess: (res, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
    },
    ...props,
  });
}

/**
 * Activate the given tax rate.
 */
export function useActivateTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`tax-rates/${id}/active`), {
    onSuccess: (res, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
    },
    ...props,
  });
}

/**
 * Inactivate the given tax rate.
 */
export function useInactivateTaxRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`tax-rates/${id}/inactive`), {
    onSuccess: (res, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries([QUERY_TYPES.TAX_RATES, id]);
    },
    ...props,
  });
}
