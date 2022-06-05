import React from 'react';

const PaymentReceiveDeleteAlert = React.lazy(() =>
  import('../../Alerts/PaymentReceives/PaymentReceiveDeleteAlert'),
);

/**
 * PaymentReceives alert.
 */
export default [
  { name: 'payment-receive-delete', component: PaymentReceiveDeleteAlert },
];
