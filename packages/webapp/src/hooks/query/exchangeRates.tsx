// @ts-nocheck
import { useQuery } from 'react-query';
import QUERY_TYPES from './types';

function getRandomItemFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

/**
 * Retrieves tax rates.
 * @param {number} customerId - Customer id.
 */
export function useExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  props,
) {
  return useQuery(
    [QUERY_TYPES.EXCHANGE_RATE, fromCurrency, toCurrency],
    () =>
      Promise.resolve({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        exchange_rate: getRandomItemFromArray([4.231, 2.231]),
      }),
    props,
  );
}
