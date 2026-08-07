import React, { ComponentType, LazyExoticComponent } from 'react';

const InventoryAdjustmentDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/InventoryAdjustmentDeleteAlert').then(
    (m) => ({ default: m.InventoryAdjustmentDeleteAlert }),
  ),
);

const InventoryAdjustmentPublishAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/InventoryAdjustmentPublishAlert').then(
    (m) => ({ default: m.InventoryAdjustmentPublishAlert }),
  ),
);

interface AlertItem {
  name: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

export const InventoryAdjustmentsAlerts: AlertItem[] = [
  {
    name: 'inventory-adjustment-delete',
    component: InventoryAdjustmentDeleteAlert,
  },
  {
    name: 'inventory-adjustment-publish',
    component: InventoryAdjustmentPublishAlert,
  },
];
