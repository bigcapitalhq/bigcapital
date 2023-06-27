// @ts-nocheck
import React from 'react';

const PaymentMadeDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/PaymentsMade/PaymentMadeDeleteAlert'),
);

export default [
  { name: 'payment-made-delete', component: PaymentMadeDeleteAlert },
];
