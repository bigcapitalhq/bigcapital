// @ts-nocheck
import React from 'react';

const PaymentReceiveDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/PaymentReceives/PaymentReceiveDeleteAlert'),
);

/**
 * PaymentReceives alert.
 */
export default [
  { name: 'payment-receive-delete', component: PaymentReceiveDeleteAlert },
];
