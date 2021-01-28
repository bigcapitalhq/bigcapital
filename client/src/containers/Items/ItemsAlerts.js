import React from 'react';
import ItemDeleteAlert from 'containers/Alerts/Items/ItemDeleteAlert';
import ItemInactivateAlert from 'containers/Alerts/Items/ItemInactivateAlert';
import ItemActivateAlert from 'containers/Alerts/Items/ItemActivateAlert';
import ItemBulkDeleteAlert from 'containers/Alerts/Items/ItemBulkDeleteAlert';
import ItemCategoryDeleteAlert from 'containers/Alerts/Items/ItemCategoryDeleteAlert';
import ItemCategoryBulkDeleteAlert from 'containers/Alerts/Items/ItemCategoryBulkDeleteAlert';
import InventoryAdjustmentDeleteAlert from 'containers/Alerts/Items/InventoryAdjustmentDeleteAlert';

/**
 * Items alert.
 */
export default function ItemsAlerts() {
  return (
    <div>
      <ItemDeleteAlert name={'item-delete'} />
      <ItemInactivateAlert name={'item-inactivate'} />
      <ItemActivateAlert name={'item-activate'} />
      <ItemBulkDeleteAlert name={'items-bulk-delete'} />
      <ItemCategoryDeleteAlert name={'item-category-delete'} />
      <ItemCategoryBulkDeleteAlert name={'item-categories-bulk-delete'} />
      <InventoryAdjustmentDeleteAlert name={'inventory-adjustment-delete'} />
    </div>
  );
}
