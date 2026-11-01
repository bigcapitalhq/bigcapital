import React from 'react';

const PaymentReceivedDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/PaymentReceived/PaymentReceivedDeleteAlert').then(
    (m) => ({ default: m.PaymentReceivedDeleteAlert }),
  ),
);

/**
 * PaymentReceives alert.
 */
export const PaymentsReceivedAlerts = [
  { name: 'payment-received-delete', component: PaymentReceivedDeleteAlert },
];
