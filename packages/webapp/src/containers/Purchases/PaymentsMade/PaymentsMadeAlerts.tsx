import React from 'react';

const PaymentMadeDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/PaymentMades/PaymentMadeDeleteAlert').then(
    (m) => ({ default: m.PaymentMadeDeleteAlert }),
  ),
);

export const PaymentsMadeAlerts = [
  { name: 'payment-made-delete', component: PaymentMadeDeleteAlert },
];
