import React from 'react';

import 'style/pages/InventoryAdjustments/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';
import InventoryAdjustmentsAlerts from './InventoryAdjustmentsAlerts';

import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import InventoryAdjustmentTable from './InventoryAdjustmentTable';

import withInventoryAdjustments from './withInventoryAdjustments';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
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

        <InventoryAdjustmentsAlerts />
      </DashboardPageContent>
    </InventoryAdjustmentsProvider>
  );
}

export default compose(
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentList);
