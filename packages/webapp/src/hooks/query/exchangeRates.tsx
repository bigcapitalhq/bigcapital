// @ts-nocheck
import { useQuery } from 'react-query';
import QUERY_TYPES from './types';
import useApiRequest from '../useRequest';

/**
 * Retrieves latest exchange rate.
 * @param {number} customerId - Customer id.
 */
export function useLatestExchangeRate(toCurrency: string, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [QUERY_TYPES.EXCHANGE_RATE, toCurrency],
    () =>
      apiRequest
        .http({
          url: `/api/exchange_rates/latest`,
          method: 'get',
          params: {
            to_currency: toCurrency,
          },
        })
        .then((res) => res.data),
    props,
  );
}
