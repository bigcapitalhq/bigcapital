// @ts-nocheck
import React from 'react';
import { WarehousesProvider } from './WarehousesProvider';
import Warehouses from './Warehouses';

/**
 * Warehouses Preferences.
 * @returns
 */
export default function WarehousesPeferences() {
  return (
    <WarehousesProvider>
      <Warehouses />
    </WarehousesProvider>
  );
}
