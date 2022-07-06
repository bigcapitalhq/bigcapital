import React from 'react';

const VendorCreditDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/VendorCeditNotes/VendorCreditDeleteAlert'),
);

const RefundVendorCreditDeleteAlert = React.lazy(
  () =>
    import(
      '@/containers/Alerts/VendorCeditNotes/RefundVendorCreditDeleteAlert'
    ),
);

const OpenVendorCreditAlert = React.lazy(
  () => import('@/containers/Alerts/VendorCeditNotes/VendorCreditOpenedAlert'),
);

const ReconcileVendorCreditDeleteAlert = React.lazy(
  () =>
    import(
      '@/containers/Alerts/VendorCeditNotes/ReconcileVendorCreditDeleteAlert'
    ),
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
