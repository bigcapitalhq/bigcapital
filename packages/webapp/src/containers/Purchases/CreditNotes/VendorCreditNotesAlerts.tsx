import React from 'react';

const VendorCreditDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/VendorCeditNotes/VendorCreditDeleteAlert').then(
    (m) => ({ default: m.VendorCreditDeleteAlert }),
  ),
);

const RefundVendorCreditDeleteAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/VendorCeditNotes/RefundVendorCreditDeleteAlert'
  ).then((m) => ({ default: m.RefundVendorCreditDeleteAlert })),
);

const OpenVendorCreditAlert = React.lazy(() =>
  import('@/containers/Alerts/VendorCeditNotes/VendorCreditOpenedAlert').then(
    (m) => ({ default: m.VendorCreditOpenedAlert }),
  ),
);

const ReconcileVendorCreditDeleteAlert = React.lazy(() =>
  import(
    '@/containers/Alerts/VendorCeditNotes/ReconcileVendorCreditDeleteAlert'
  ).then((m) => ({ default: m.ReconcileVendorCreditDeleteAlert })),
);

/**
 * Vendor Credit notes alerts.
 */
export const VendorCreditNotesAlerts = [
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
