// @ts-nocheck
import React from 'react';

const PaymentReceivedDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/PaymentReceived/PaymentReceivedDeleteAlert'),
);

/**
 * PaymentReceives alert.
 */
export default [
  { name: 'payment-received-delete', component: PaymentReceivedDeleteAlert },
];
