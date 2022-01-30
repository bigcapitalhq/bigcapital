import React from 'react';
import { WarehousesProvider } from './WarehousesProvider';
import Warehouses from './WarehousesList';

/**
 * Warehouses Preferences.
 * @returns
 */
export default function WarehousesPerences() {
  return (
    <WarehousesProvider>
      <Warehouses />
    </WarehousesProvider>
  );
}
