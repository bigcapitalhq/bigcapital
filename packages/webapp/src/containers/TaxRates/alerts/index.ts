import { lazy } from 'react';

const TaxRateDeleteAlert = lazy(() =>
  import('./TaxRateDeleteAlert').then((m) => ({
    default: m.TaxRateDeleteAlert,
  })),
);

/**
 * Tax rates alerts.
 */
export const TaxRatesAlerts = [
  { name: 'tax-rate-delete', component: TaxRateDeleteAlert },
];
