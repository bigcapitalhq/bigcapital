import React from 'react';

const VendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/VendorCreditDeleteAlert'),
);

const RefundVendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/RefundVendorCreditDeleteAlert'),
);

/**
 * Vendor Credit notes alerts.
 */
export default [
  {
    name: 'vendor-credit-delete',
    component: VendorCreditDeleteAlert,
  },
  {
    name: 'refund-vendor-delete',
    component: RefundVendorCreditDeleteAlert,
  },
];
