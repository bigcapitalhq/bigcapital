import React from 'react';
import { WarehousesProvider } from './WarehousesProvider';
import WarehousesList from './WarehousesList';

/**
 * Warehouses Preferences.
 * @returns
 */
export default function WarehousesPerences() {
  return (
    <WarehousesProvider>
      <WarehousesList />
    </WarehousesProvider>
  );
}
