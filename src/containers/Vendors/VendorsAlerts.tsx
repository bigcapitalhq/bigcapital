// @ts-nocheck
import React from 'react';

const VendorDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Vendors/VendorDeleteAlert'),
);
const VendorActivateAlert = React.lazy(
  () => import('@/containers/Alerts/Vendors/VendorActivateAlert'),
);
const VendorInactivateAlert = React.lazy(
  () => import('@/containers/Alerts/Vendors/VendorInactivateAlert'),
);

export default [
  { name: 'vendor-delete', component: VendorDeleteAlert },
  { name: 'vendor-activate', component: VendorActivateAlert },
  { name: 'vendor-inactivate', component: VendorInactivateAlert },
];
