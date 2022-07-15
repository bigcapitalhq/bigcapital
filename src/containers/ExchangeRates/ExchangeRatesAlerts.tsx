import React from 'react';

const ExchangeRateDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/ExchangeRates/ExchangeRateDeleteAlert'),
);

export default [
  { name: 'exchange-rate-delete', component: ExchangeRateDeleteAlert },
];
