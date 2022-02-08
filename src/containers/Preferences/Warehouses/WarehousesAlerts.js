import React from 'react';

const WarehouseDeleteAlert = React.lazy(() =>
  import('../../Alerts/Warehouses/WarehouseDeleteAlert'),
);
const WarehouseMarkPrimaryAlert = React.lazy(() =>
  import('../../Alerts/Warehouses/WarehouseMarkPrimaryAlert'),
);

/**
 * Warehouses alerts.
 */
export default [
  { name: 'warehouse-delete', component: WarehouseDeleteAlert },
  {
    name: 'warehouse-mark-primary',
    component: WarehouseMarkPrimaryAlert,
  },
];
