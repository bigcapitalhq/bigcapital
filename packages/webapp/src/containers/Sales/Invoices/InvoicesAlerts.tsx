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

const InvoiceBulkDeleteAlert = React.lazy(
  () => import('@/containers/Alerts/Invoices/InvoiceBulkDeleteAlert'),
);

/**
 * Invoices alert.
 */
export default [
  { name: 'invoice-delete', component: InvoiceDeleteAlert },
  { name: 'invoice-deliver', component: InvoiceDeliverAlert },
  { name: 'cancel-bad-debt', component: CancelBadDebtAlert },
  { name: 'invoices-bulk-delete', component: InvoiceBulkDeleteAlert },
];
