import React from 'react';

const InventoryAdjustmentDeleteAlert = React.lazy(() =>
  import('../Alerts/Items/InventoryAdjustmentDeleteAlert'),
);

const InventoryAdjustmentPublishAlert = React.lazy(() =>
  import('../Alerts/Items/InventoryAdjustmentPublishAlert'),
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
