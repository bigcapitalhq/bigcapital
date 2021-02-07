import React from 'react';
import ItemDeleteAlert from 'containers/Alerts/Items/ItemDeleteAlert';
import ItemInactivateAlert from 'containers/Alerts/Items/ItemInactivateAlert';
import ItemActivateAlert from 'containers/Alerts/Items/ItemActivateAlert';
import ItemBulkDeleteAlert from 'containers/Alerts/Items/ItemBulkDeleteAlert';

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
    </div>
  );
}
