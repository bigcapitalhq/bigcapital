import React from 'react';

const WarehouseTransferDeleteAlert = React.lazy(() =>
  import('../Alerts/Warehouses/WarehouseTransferDeleteAlert'),
);

/**
 * Warehouses alerts.
 */
export default [
  {
    name: 'warehouse-transfer-delete',
    component: WarehouseTransferDeleteAlert,
  },
];
