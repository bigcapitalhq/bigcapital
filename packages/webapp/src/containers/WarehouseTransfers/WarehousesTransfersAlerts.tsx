import React from 'react';

const WarehouseTransferDeleteAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/WarehousesTransfer/WarehouseTransferDeleteAlert'
  ).then((m) => ({ default: m.WarehouseTransferDeleteAlert })),
);
const WarehouseTransferInitiateAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/WarehousesTransfer/WarehouseTransferInitiateAlert'
  ).then((m) => ({ default: m.WarehouseTransferInitiateAlert })),
);
const TransferredWarehouseTransferAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/WarehousesTransfer/TransferredWarehouseTransferAlert'
  ).then((m) => ({ default: m.TransferredWarehouseTransferAlert })),
);

interface AlertRegistration {
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<unknown>>;
}

/**
 * Warehouses alerts.
 */
export const WarehousesTransfersAlerts: AlertRegistration[] = [
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
