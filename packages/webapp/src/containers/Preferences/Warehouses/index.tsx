import React from 'react';
import { Warehouses } from './Warehouses';
import { WarehousesProvider } from './WarehousesProvider';

export function WarehousesPerences(): React.ReactElement {
  return (
    <WarehousesProvider>
      <Warehouses />
    </WarehousesProvider>
  );
}
