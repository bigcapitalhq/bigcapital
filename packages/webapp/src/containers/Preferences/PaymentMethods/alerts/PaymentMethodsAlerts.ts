import React from 'react';

const DeleteStripeConnectionAlert = React.lazy(() =>
  import('./DeleteStripeConnectionAlert').then((m) => ({
    default: m.DeleteStripeConnectionAlert,
  })),
);

export const PaymentMethodsAlerts = [
  {
    name: 'delete-stripe-payment-method',
    component: DeleteStripeConnectionAlert,
  },
];
