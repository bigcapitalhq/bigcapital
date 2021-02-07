import React from 'react';
import InventoryAdjustmentDataTable from './InventoryAdjustmentDataTable';
import withAlertsActions from 'containers/Alert/withAlertActions';
import { useInventoryAdjustmentsContext } from './InventoryAdjustmentsProvider';
import { compose } from 'utils';

/**
 * Inventory adjustments view page.
 */
function InventoryAdjustmentsView({
  // #withAlertsActions.
  openAlert,
}) {
  const {
    isAdjustmentsLoading,
    inventoryAdjustments,
  } = useInventoryAdjustmentsContext();

  // Handle delete inventory adjustment transaction.
  const handleDeleteInventoryAdjustment = ({ id }) => {
    openAlert('inventory-adjustment-delete', { inventoryId: id });
  };

  return (
    <InventoryAdjustmentDataTable
      inventoryAdjustments={inventoryAdjustments}
      isLoading={isAdjustmentsLoading}
      onDeleteInventoryAdjustment={handleDeleteInventoryAdjustment}
    />
  );
}

export default compose(withAlertsActions)(InventoryAdjustmentsView);
