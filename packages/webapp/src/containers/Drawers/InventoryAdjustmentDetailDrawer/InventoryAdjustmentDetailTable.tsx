import React from 'react';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';
import { useInventoryAdjustmentEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';

/**
 * Inventory adjustment detail entries table.
 */
export function InventoryAdjustmentDetailTable() {
  const columns = useInventoryAdjustmentEntriesColumns();
  const { inventoryAdjustment } = useInventoryAdjustmentDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={inventoryAdjustment?.entries ?? []}
      className={'table-constrant'}
    />
  );
}
