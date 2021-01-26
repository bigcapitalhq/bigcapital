import React from 'react';
import ItemDeleteAlert from 'containers/Alerts/Item/ItemDeleteAlert';
import ItemInactivateAlert from 'containers/Alerts/Item/ItemInactivateAlert';
import ItemActivateAlert from 'containers/Alerts/Item/ItemActivateAlert';
import ItemBulkDeleteAlert from 'containers/Alerts/Item/ItemBulkDeleteAlert';
import ItemCategoryDeleteAlert from 'containers/Alerts/Item/ItemCategoryDeleteAlert';
import ItemCategoryBulkDeleteAlert from 'containers/Alerts/Item/ItemCategoryBulkDeleteAlert';
import InventoryAdjustmentDeleteAlert from 'containers/Alerts/Item/InventoryAdjustmentDeleteAlert';

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
