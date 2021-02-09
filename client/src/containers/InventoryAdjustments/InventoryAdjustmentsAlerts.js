import React from 'react';
import InventoryAdjustmentDeleteAlert from 'containers/Alerts/Items/InventoryAdjustmentDeleteAlert';

export default function InventoryAdjustmentsAlerts() {
  return (
    <div className={'inventory-adjustments-alert'}>
      <InventoryAdjustmentDeleteAlert name={'inventory-adjustment-delete'} />
    </div>
  );
}
