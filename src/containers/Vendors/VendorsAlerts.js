import React from 'react';

const VendorDeleteAlert = React.lazy(() =>
  import('../Alerts/Vendors/VendorDeleteAlert'),
);
const VendorActivateAlert = React.lazy(() =>
  import('../Alerts/Vendors/VendorActivateAlert'),
);
const VendorInactivateAlert = React.lazy(() =>
  import('../Alerts/Vendors/VendorInactivateAlert'),
);

export default [
  { name: 'vendor-delete', component: VendorDeleteAlert },
  { name: 'vendor-activate', component: VendorActivateAlert },
  { name: 'vendor-inactivate', component: VendorInactivateAlert },
];
