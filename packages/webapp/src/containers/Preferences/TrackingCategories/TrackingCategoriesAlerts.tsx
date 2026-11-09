import React from 'react';

const TrackingCategoryDeleteAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/TrackingCategories/TrackingCategoryDeleteAlert'
  ).then((m) => ({
    default: m.TrackingCategoryDeleteAlert,
  })),
);

export const TrackingCategoriesAlerts = [
  { name: 'tracking-category-delete', component: TrackingCategoryDeleteAlert },
];
