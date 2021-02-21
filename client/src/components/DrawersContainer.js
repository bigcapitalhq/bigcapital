import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimates/EstimateDetails/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoices/InvoiceDetails/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipts/ReceiptDetails/ReceiptDrawer';
import PaymentReceive from 'containers/Sales/PaymentReceives/PaymentDetails/PaymentDrawer';

export default function DrawersContainer() {
  return (
    <div>
      <EstimateDrawer name={'estimate-drawer'} />
      <InvoiceDrawer name={'invoice-drawer'} />
      <ReceiptDrawer name={'receipt-drawer'} />
      <PaymentReceive name={'payment-receive-drawer'} />
    </div>
  );
}
