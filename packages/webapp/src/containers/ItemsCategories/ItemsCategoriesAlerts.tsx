import React, { ComponentType, LazyExoticComponent } from 'react';

const ItemCategoryDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Items/ItemCategoryDeleteAlert').then((m) => ({
    default: m.ItemCategoryDeleteAlert,
  })),
);

interface AlertItem {
  name: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

export const ItemsCategoriesAlerts: AlertItem[] = [
  { name: 'item-category-delete', component: ItemCategoryDeleteAlert },
];
