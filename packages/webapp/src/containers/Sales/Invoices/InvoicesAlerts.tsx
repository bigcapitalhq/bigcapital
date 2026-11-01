import React from 'react';

const InvoiceDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/Invoices/InvoiceDeleteAlert').then((m) => ({
    default: m.InvoiceDeleteAlert,
  })),
);
const InvoiceDeliverAlert = React.lazy(() =>
  import('@/containers/Alerts/Invoices/InvoiceDeliverAlert').then((m) => ({
    default: m.InvoiceDeliverAlert,
  })),
);

const CancelBadDebtAlert = React.lazy(() =>
  import('@/containers/Alerts/Invoices/CancelBadDebtAlert').then((m) => ({
    default: m.CancelBadDebtAlert,
  })),
);

/**
 * Invoices alert.
 */
export const InvoicesAlerts = [
  { name: 'invoice-delete', component: InvoiceDeleteAlert },
  { name: 'invoice-deliver', component: InvoiceDeliverAlert },
  { name: 'cancel-bad-debt', component: CancelBadDebtAlert },
];
