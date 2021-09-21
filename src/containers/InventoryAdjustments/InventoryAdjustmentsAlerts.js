import React from 'react';
import InventoryAdjustmentDeleteAlert from 'containers/Alerts/Items/InventoryAdjustmentDeleteAlert';
import InventoryAdjustmentPublishAlert from 'containers/Alerts/Items/InventoryAdjustmentPublishAlert';

export default function InventoryAdjustmentsAlerts() {
  return (
    <div className={'inventory-adjustments-alert'}>
      <InventoryAdjustmentDeleteAlert name={'inventory-adjustment-delete'} />
      <InventoryAdjustmentPublishAlert name={'inventory-adjustment-publish'} />
    </div>
  );
}
