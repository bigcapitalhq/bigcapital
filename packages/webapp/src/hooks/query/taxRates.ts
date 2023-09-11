// @ts-nocheck
import { useRequestQuery } from '../useQueryRequest';
import QUERY_TYPES from './types';

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
