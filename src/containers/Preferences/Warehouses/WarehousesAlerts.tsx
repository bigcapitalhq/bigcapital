// @ts-nocheck
import React from 'react';

const WarehouseDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Warehouses/WarehouseDeleteAlert'),
);

/**
 * Warehouses alerts.
 */
export default [{ name: 'warehouse-delete', component: WarehouseDeleteAlert }];
