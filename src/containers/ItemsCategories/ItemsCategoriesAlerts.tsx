import React from 'react';

const ItemCategoryDeleteAlert = React.lazy(() =>
  import('../Alerts/Items/ItemCategoryDeleteAlert'),
);

export default [
  { name: 'item-category-delete', component: ItemCategoryDeleteAlert },
];
