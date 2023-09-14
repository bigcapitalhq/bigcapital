// @ts-nocheck
import React from 'react';

const TaxRateDeleteAlert = React.lazy(() => import('./TaxRateDeleteAlert'));

/**
 * Project alerts.
 */
export default [
  { name: 'tax-rate-delete', component: TaxRateDeleteAlert },
];
