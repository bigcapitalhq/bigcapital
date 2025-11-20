// @ts-nocheck
import React from 'react';

const ItemDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Items/ItemDeleteAlert'),
);

const ItemInactivateAlert = React.lazy(
  () => import('@/containers/Alerts/Items/ItemInactivateAlert'),
);

const ItemActivateAlert = React.lazy(
  () => import('@/containers/Alerts/Items/ItemActivateAlert'),
);

const cancelUnlockingPartialAlert = React.lazy(
  () =>
    import(
      '@/containers/Alerts/TransactionLocking/cancelUnlockingPartialAlert'
    ),
);

/**
 * Items alert.
 */
export default [
  {
    name: 'item-delete',
    component: ItemDeleteAlert,
  },
  {
    name: 'item-inactivate',
    component: ItemInactivateAlert,
  },
  {
    name: 'item-activate',
    component: ItemActivateAlert,
  },
];
