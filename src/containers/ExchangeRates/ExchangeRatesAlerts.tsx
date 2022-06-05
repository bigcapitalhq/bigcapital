import React from 'react';

const ExchangeRateDeleteAlert = React.lazy(() =>
  import('../Alerts/ExchangeRates/ExchangeRateDeleteAlert'),
);

export default [
  { name: 'exchange-rate-delete', component: ExchangeRateDeleteAlert },
];
