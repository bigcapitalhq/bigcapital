import React from 'react';

const CustomerDeleteAlert = React.lazy(() =>
  import('../Alerts/Customers/CustomerDeleteAlert'),
);
const CustomerActivateAlert = React.lazy(() =>
  import('../Alerts/Customers/CustomerActivateAlert'),
);
const CustomerInactivateAlert = React.lazy(() =>
  import('../Alerts/Customers/CustomerInactivateAlert'),
);

/**
 * Customers alert.
 */
export default [
  { name: 'customer-delete', component: CustomerDeleteAlert },
  { name: 'customer-activate', component: CustomerActivateAlert },
  { name: 'customer-inactivate', component: CustomerInactivateAlert },
];
