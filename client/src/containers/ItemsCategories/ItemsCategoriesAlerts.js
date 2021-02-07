import React from 'react';
import ItemCategoryDeleteAlert from 'containers/Alerts/Items/ItemCategoryDeleteAlert';
// import ItemCategoryBulkDeleteAlert from 'containers/Alerts/Items/ItemCategoryBulkDeleteAlert';

export default function ItemsCategoriesAlerts() {
  return (
    <div class="items-categories-alerts">
      <ItemCategoryDeleteAlert name={'item-category-delete'} />
      {/* <ItemCategoryBulkDeleteAlert name={'item-categories-bulk-delete'} /> */}
    </div>
  );
}
