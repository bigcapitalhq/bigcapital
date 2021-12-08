import React from 'react';

const VendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/VendorCreditDeleteAlert'),
);

const RefundVendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/RefundVendorCreditDeleteAlert'),
);

const OpenVendorCreditAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/VendorCreditOpenedAlert'),
);

const ReconcileVendorCreditDeleteAlert = React.lazy(() =>
  import('../../Alerts/VendorCeditNotes/ReconcileVendorCreditDeleteAlert'),
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
    name: 'vendor-credit-open',
    component: OpenVendorCreditAlert,
  },
  {
    name: 'refund-vendor-delete',
    component: RefundVendorCreditDeleteAlert,
  },
  {
    name: 'reconcile-vendor-delete',
    component: ReconcileVendorCreditDeleteAlert,
  },
];
