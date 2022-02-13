import React from 'react';
import { isEmpty } from 'lodash';
import WarehousesEmptyStatus from './WarehousesEmptyStatus';
import { useWarehousesContext } from './WarehousesProvider';
import { WarehousesList, WarehousesSkeleton } from './components';
import WarehousesGridItems from './WarehousesGridItems';

/**
 * Warehouses grid.
 */
export default function WarehousesGrid() {
  // Retrieve list context.
  const { warehouses, isWarehouesLoading } = useWarehousesContext();

  return (
    <React.Fragment>
      <WarehousesList>
        {isWarehouesLoading ? (
          <WarehousesSkeleton />
        ) : isEmpty(warehouses) ? (
          <WarehousesEmptyStatus />
        ) : (
          <WarehousesGridItems warehouses={warehouses} />
        )}
      </WarehousesList>
    </React.Fragment>
  );
}
