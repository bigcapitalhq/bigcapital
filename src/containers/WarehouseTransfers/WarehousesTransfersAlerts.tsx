import React from 'react';

const WarehouseTransferDeleteAlert = React.lazy(() =>
  import('../Alerts/WarehousesTransfer/WarehouseTransferDeleteAlert'),
);
const WarehouseTransferInitiateAlert = React.lazy(() =>
  import('../Alerts/WarehousesTransfer/WarehouseTransferInitiateAlert'),
);
const TransferredWarehouseTransferAlert = React.lazy(() =>
  import('../Alerts/WarehousesTransfer/TransferredWarehouseTransferAlert'),
);

/**
 * Warehouses alerts.
 */
export default [
  {
    name: 'warehouse-transfer-delete',
    component: WarehouseTransferDeleteAlert,
  },
  {
    name: 'warehouse-transfer-initate',
    component: WarehouseTransferInitiateAlert,
  },
  {
    name: 'transferred-warehouse-transfer',
    component: TransferredWarehouseTransferAlert,
  },
];
