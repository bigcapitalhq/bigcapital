import React from 'react';

const VendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/VendorCreditDeleteAlert'),
);

/**
 * Vendor Credit notes alerts.
 */
export default [
  {
    name: 'vendor-credit-delete',
    component: VendorCreditDeleteAlert,
  },
];
