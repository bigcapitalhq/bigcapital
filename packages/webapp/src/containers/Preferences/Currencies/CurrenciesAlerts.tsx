import React from 'react';

const CurrencyDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Currencies/CurrencyDeleteAlert').then((m) => ({
    default: m.CurrencyDeleteAlert,
  })),
);
export const CurrenciesAlerts = [
  { name: 'currency-delete', component: CurrencyDeleteAlert },
];
