// @ts-nocheck
import React from 'react';

const ItemCategoryDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Items/ItemCategoryDeleteAlert'),
);

export default [
  { name: 'item-category-delete', component: ItemCategoryDeleteAlert },
];
