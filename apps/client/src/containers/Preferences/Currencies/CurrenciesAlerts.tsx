// @ts-nocheck
import React from 'react';

const CurrencyDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Currencies/CurrencyDeleteAlert'),
);
export default [{ name: 'currency-delete', component: CurrencyDeleteAlert }];
