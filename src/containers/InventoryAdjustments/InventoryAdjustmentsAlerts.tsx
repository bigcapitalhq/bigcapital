// @ts-nocheck
import React from 'react';

const InventoryAdjustmentDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Items/InventoryAdjustmentDeleteAlert'),
);

const InventoryAdjustmentPublishAlert = React.lazy(
  () => import('@/containers/Alerts/Items/InventoryAdjustmentPublishAlert'),
);

export default [
  {
    name: 'inventory-adjustment-delete',
    component: InventoryAdjustmentDeleteAlert,
  },
  {
    name: 'inventory-adjustment-publish',
    component: InventoryAdjustmentPublishAlert,
  },
];
