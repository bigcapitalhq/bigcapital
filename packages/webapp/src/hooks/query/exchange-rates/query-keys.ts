// Query key constants
export const EXCHANGE_RATE = 'EXCHANGE_RATE';

// Query key factory
export const exchangeRateKeys = {
  rate: (fromCurrency?: string, toCurrency?: string) =>
    [EXCHANGE_RATE, toCurrency, fromCurrency] as const,
};

// Grouped object for use in components/hooks
export const ExchangeRatesQueryKeys = {
  EXCHANGE_RATE,
} as const;
