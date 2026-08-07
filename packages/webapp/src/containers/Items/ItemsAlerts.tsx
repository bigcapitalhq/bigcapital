import React, { ComponentType, LazyExoticComponent } from 'react';

const ItemDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/ItemDeleteAlert').then((m) => ({
    default: m.ItemDeleteAlert,
  })),
);

const ItemInactivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/ItemInactivateAlert').then((m) => ({
    default: m.ItemInactivateAlert,
  })),
);

const ItemActivateAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/ItemActivateAlert').then((m) => ({
    default: m.ItemActivateAlert,
  })),
);

// Note: lowercase default export name preserved from @ts-nocheck original.
// eslint-disable-next-line @typescript-eslint/naming-convention
const cancelUnlockingPartialAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/TransactionLocking/cancelUnlockingPartialAlert'
  ).then((m) => ({ default: m.cancelUnlockingPartialAlert })),
);

void cancelUnlockingPartialAlert;

interface AlertItem {
  name: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

/**
 * Items alert.
 */
export const ItemsAlerts: AlertItem[] = [
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
