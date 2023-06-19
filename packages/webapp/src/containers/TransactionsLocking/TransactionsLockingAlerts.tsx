// @ts-nocheck
import React from 'react';

const cancelUnlockingPartialAlert = React.lazy(
  () =>
    import(
      '@/containers/Alerts/TransactionLocking/cancelUnlockingPartialAlert'
    ),
);

/**
 * Transactions alerts.
 */
export default [
  {
    name: 'cancel-unlocking-partial',
    component: cancelUnlockingPartialAlert,
  },
];
