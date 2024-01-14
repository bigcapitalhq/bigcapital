// @ts-nocheck
import { useQuery } from 'react-query';
import QUERY_TYPES from './types';

function getRandomItemFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
function delay(t, val) {
  return new Promise((resolve) => setTimeout(resolve, t, val));
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
    async () => {
      await delay(100);

      return {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        exchange_rate: 1.00,
      };
    },
    props,
  );
}
