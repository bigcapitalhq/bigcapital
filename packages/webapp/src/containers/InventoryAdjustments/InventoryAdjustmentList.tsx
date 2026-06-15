// @ts-nocheck
import React from 'react';

import '@/style/pages/InventoryAdjustments/List.scss';

import { DashboardContentTable, DashboardPageContent } from '@/components';

import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import { InventoryAdjustmentTable } from './InventoryAdjustmentTable';

import { withInventoryAdjustments } from './withInventoryAdjustments';

import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentListInner({
  // #withInventoryAdjustments
  inventoryAdjustmentTableState,
}) {
  return (
    <InventoryAdjustmentsProvider
      query={transformTableStateToQuery(inventoryAdjustmentTableState)}
    >
      <DashboardPageContent>
        <DashboardContentTable>
          <InventoryAdjustmentTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </InventoryAdjustmentsProvider>
  );
}

export const InventoryAdjustmentList = flow(
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentListInner);
