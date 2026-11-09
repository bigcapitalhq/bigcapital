// Query key constants
export const CURRENCIES = 'CURRENCIES';

// Query key factory
export const currenciesKeys = {
  all: () => [CURRENCIES] as const,
};

// Grouped object for use in components/hooks
export const CurrenciesQueryKeys = {
  CURRENCIES,
} as const;
