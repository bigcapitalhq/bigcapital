// @ts-nocheck
import { useQuery } from 'react-query';
import QUERY_TYPES from './types';
import useApiRequest from '../useRequest';

interface LatestExchangeRateQuery {
  fromCurrency?: string;
  toCurrency?: string;
}

/**
 * Retrieves latest exchange rate.
 * @param {number} customerId - Customer id.
 */
export function useLatestExchangeRate(
  { toCurrency, fromCurrency }: LatestExchangeRateQuery,
  props,
) {
  const apiRequest = useApiRequest();

  return useQuery(
    [QUERY_TYPES.EXCHANGE_RATE, toCurrency, fromCurrency],
    () =>
      apiRequest
        .http({
          url: `/api/exchange_rates/latest`,
          method: 'get',
          params: {
            to_currency: toCurrency,
            from_currency: fromCurrency,
          },
        })
        .then((res) => res.data),
    props,
  );
}
