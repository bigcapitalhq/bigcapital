import React from 'react';

const InvoiceDeleteAlert = React.lazy(() =>
  import('../../Alerts/Invoices/InvoiceDeleteAlert'),
);
const InvoiceDeliverAlert = React.lazy(() =>
  import('../../Alerts/Invoices/InvoiceDeliverAlert'),
);

const CancelBadDebtAlert = React.lazy(() =>
  import('../../Alerts/Invoices/CancelBadDebtAlert'),
);

/**
 * Invoices alert.
 */
export default [
  { name: 'invoice-delete', component: InvoiceDeleteAlert },
  { name: 'invoice-deliver', component: InvoiceDeliverAlert },
  { name: 'cancel-bad-debt', component: CancelBadDebtAlert },
];
