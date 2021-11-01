import React from 'react';

const InvoiceDeleteAlert = React.lazy(() =>
  import('../../Alerts/Invoices/InvoiceDeleteAlert'),
);
const InvoiceDeliverAlert = React.lazy(() =>
  import('../../Alerts/Invoices/InvoiceDeliverAlert'),
);

const BadDebtAlert = React.lazy(() =>
  import('../../Alerts/Invoices/BadDebtAlert'),
);

/**
 * Invoices alert.
 */
export default [
  { name: 'invoice-delete', component: InvoiceDeleteAlert },
  { name: 'invoice-deliver', component: InvoiceDeliverAlert },
  { name: 'bad-debt', component: BadDebtAlert },
];
