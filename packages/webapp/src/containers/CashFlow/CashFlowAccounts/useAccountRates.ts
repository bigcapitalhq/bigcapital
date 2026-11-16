import { fetchLatestExchangeRate } from '@bigcapital/sdk-ts';
import { useQueries } from '@tanstack/react-query';
import { exchangeRateKeys } from '@/hooks/query/exchange-rates/query-keys';
import { useApiFetcher } from '@/hooks/useRequest';

/**
 * Latest rates from each foreign account currency to the base currency, via
 * the exchange-rate endpoint the entry forms already use. A currency whose
 * rate cannot be fetched (no provider configured) is simply absent, so the
 * page omits its equivalent rather than inventing one.
 */
export function useAccountRates(
  currencies: string[],
  baseCurrency: string | undefined,
): Record<string, number> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const foreign = Array.from(new Set(currencies)).filter(
    (currency) => currency && baseCurrency && currency !== baseCurrency,
  );
  const results = useQueries({
    queries: foreign.map((currency) => ({
      queryKey: exchangeRateKeys.rate(currency, baseCurrency),
      queryFn: () =>
        fetchLatestExchangeRate(fetcher, {
          from_currency: currency,
          to_currency: baseCurrency,
        }),
      enabled: !!baseCurrency,
      retry: 0,
      refetchOnWindowFocus: false,
    })),
  });

  const rates: Record<string, number> = {};
  results.forEach((result, index) => {
    const rate = result.data?.exchangeRate;
    if (typeof rate === 'number' && rate > 0) rates[foreign[index]] = rate;
  });
  return rates;
}
