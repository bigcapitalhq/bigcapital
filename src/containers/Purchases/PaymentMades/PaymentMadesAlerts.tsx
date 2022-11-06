// @ts-nocheck
import React from 'react';

const PaymentMadeDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/PaymentMades/PaymentMadeDeleteAlert'),
);

export default [
  { name: 'payment-made-delete', component: PaymentMadeDeleteAlert },
];
