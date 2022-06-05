import React from 'react';

const CurrencyDeleteAlert = React.lazy(() =>
  import('../../Alerts/Currencies/CurrencyDeleteAlert'),
);
export default [{ name: 'currency-delete', component: CurrencyDeleteAlert }];
