// @ts-nocheck
import React from 'react';

const DeleteStripeConnectionAlert = React.lazy(
  () => import('./DeleteStripeConnectionAlert'),
);

export const PaymentMethodsAlerts = [
  {
    name: 'delete-stripe-payment-method',
    component: DeleteStripeConnectionAlert,
  },
];
