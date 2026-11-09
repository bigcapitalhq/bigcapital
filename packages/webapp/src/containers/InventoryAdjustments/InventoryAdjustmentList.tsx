import * as FF from 'fp-ts/function';
import React from 'react';
import '@/style/pages/InventoryAdjustments/List.scss';
import { InventoryAdjustmentListDrawers } from './InventoryAdjustmentListDrawers';
import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import { InventoryAdjustmentTable } from './InventoryAdjustmentTable';
import { withInventoryAdjustments } from './withInventoryAdjustments';
import type { WithInventoryAdjustmentsProps } from './withInventoryAdjustments';
import { DashboardContentTable, DashboardPageContent } from '@/components';
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
        <DashboardContentTable>
          <InventoryAdjustmentTable />
        </DashboardContentTable>
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
