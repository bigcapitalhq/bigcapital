// @ts-nocheck
import React from 'react';
import WarehousesEmptyStatus from './WarehousesEmptyStatus';
import { useWarehousesContext } from './WarehousesProvider';
import { WarehousesList, WarehousesSkeleton } from './components';
import WarehousesGridItems from './WarehousesGridItems';

/**
 * Warehouses grid.
 */
export default function WarehousesGrid() {
  // Retrieve list context.
  const {
    warehouses,
    isWarehousesLoading,
    isEmptyStatus,
  } = useWarehousesContext();

  return (
    <React.Fragment>
      <WarehousesList>
        {isWarehousesLoading ? (
          <WarehousesSkeleton />
        ) : isEmptyStatus ? (
          <WarehousesEmptyStatus />
        ) : (
          <WarehousesGridItems warehouses={warehouses} />
        )}
      </WarehousesList>
    </React.Fragment>
  );
}
