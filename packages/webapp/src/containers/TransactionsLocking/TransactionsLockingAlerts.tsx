import React from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

const cancelUnlockingPartialAlert: LazyExoticComponent<
  ComponentType<{ name: string }>
> = React.lazy(() =>
  import(
    '@/containers/Alerts/TransactionLocking/cancelUnlockingPartialAlert'
  ).then((m) => ({ default: m.cancelUnlockingPartialAlert })),
);

interface TransactionsLockingAlertEntry {
  name: string;
  component: LazyExoticComponent<ComponentType<{ name: string }>>;
}

/**
 * Transactions alerts.
 */
export const TransactionsLockingAlerts: TransactionsLockingAlertEntry[] = [
  {
    name: 'cancel-unlocking-partail',
    component: cancelUnlockingPartialAlert,
  },
];
