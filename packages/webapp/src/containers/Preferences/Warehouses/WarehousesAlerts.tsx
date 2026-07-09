import { ComponentType, lazy } from 'react';

const WarehouseDeleteAlert = lazy(() =>
  import('@/containers/Alerts/Warehouses/WarehouseDeleteAlert').then((m) => ({
    default: m.WarehouseDeleteAlert,
  })),
);

interface WarehouseAlertEntry {
  name: string;
  component: ComponentType<unknown>;
}

export const WarehousesAlerts: WarehouseAlertEntry[] = [
  {
    name: 'warehouse-delete',
    component: WarehouseDeleteAlert as ComponentType<unknown>,
  },
];
