// @ts-nocheck
import React from 'react';

const CustomFieldDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/CustomFields/CustomFieldDeleteAlert'),
);

/**
 * Custom fields alerts
 */
export default [{ name: 'custom-field-delete', component: CustomFieldDeleteAlert }];
