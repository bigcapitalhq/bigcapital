import React from 'react';
import InvoiceDeleteAlert from 'containers/Alerts/Invoices/InvoiceDeleteAlert';
import InvoiceDeliverAlert from 'containers/Alerts/Invoices/InvoiceDeliverAlert';

/**
 * Invoices alert.
 */
export default function ItemsAlerts() {
  return (
    <div>
      <InvoiceDeleteAlert name={'invoice-delete'} />
      <InvoiceDeliverAlert name={'invoice-deliver'} />
    </div>
  );
}
