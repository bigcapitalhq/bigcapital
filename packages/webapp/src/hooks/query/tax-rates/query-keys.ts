// Query key constants
export const TAX_RATES = 'TAX_RATES';

// Query key factory
export const taxRatesKeys = {
  all: () => [TAX_RATES] as const,
  detail: (id: number | string) => [TAX_RATES, id] as const,
};

// Grouped object for use in components/hooks
export const TaxRatesQueryKeys = {
  TAX_RATES,
} as const;
