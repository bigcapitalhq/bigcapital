// @ts-nocheck
import React from 'react';

const InvoiceDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Invoices/InvoiceDeleteAlert'),
);
const InvoiceDeliverAlert = React.lazy(
  () => import('@/containers/Alerts/Invoices/InvoiceDeliverAlert'),
);

const CancelBadDebtAlert = React.lazy(
  () => import('@/containers/Alerts/Invoices/CancelBadDebtAlert'),
);

/**
 * Invoices alert.
 */
export default [
  { name: 'invoice-delete', component: InvoiceDeleteAlert },
  { name: 'invoice-deliver', component: InvoiceDeliverAlert },
  { name: 'cancel-bad-debt', component: CancelBadDebtAlert },
];
