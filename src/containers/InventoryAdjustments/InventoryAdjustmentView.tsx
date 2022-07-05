import React from 'react';
import InventoryAdjustmentDataTable from './InventoryAdjustmentDataTable';

import { compose } from '@/utils';

/**
 * Inventory adjustments view page.
 */
function InventoryAdjustmentsView({
  // #withAlertsActions.
  openAlert,
}) {
  
  return (
    <InventoryAdjustmentDataTable
      inventoryAdjustments={inventoryAdjustments}
      isLoading={isAdjustmentsLoading}
      onDeleteInventoryAdjustment={handleDeleteInventoryAdjustment}
    />
  );
}

export default compose(withAlertsActions)(InventoryAdjustmentsView);
