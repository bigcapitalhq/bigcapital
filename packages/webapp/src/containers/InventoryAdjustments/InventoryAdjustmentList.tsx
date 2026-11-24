import * as FF from 'fp-ts/function';
import React from 'react';
import { InventoryAdjustmentListDrawers } from './InventoryAdjustmentListDrawers';
import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import { InventoryAdjustmentTable } from './InventoryAdjustmentTable';
import { withInventoryAdjustments } from './withInventoryAdjustments';
import type { WithInventoryAdjustmentsProps } from './withInventoryAdjustments';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery } from '@/utils';

interface InventoryAdjustmentListInnerProps
  extends Pick<
    WithInventoryAdjustmentsProps,
    'inventoryAdjustmentTableState'
  > {}

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentListInner({
  // #withInventoryAdjustments
  inventoryAdjustmentTableState,
}: InventoryAdjustmentListInnerProps) {
  return (
    <InventoryAdjustmentsProvider
      query={transformTableStateToQuery(inventoryAdjustmentTableState)}
    >
      <InventoryAdjustmentListDrawers />

      <DashboardPageContent>
        <InventoryAdjustmentTable />
      </DashboardPageContent>
    </InventoryAdjustmentsProvider>
  );
}

export const InventoryAdjustmentList = FF.pipe(
  InventoryAdjustmentListInner,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
);
