import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimates/EstimateDetails/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoices/InvoiceDetails/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipts/ReceiptDetails/ReceiptDrawer';
import PaymentReceiveDrawer from 'containers/Sales/PaymentReceives/PaymentDetails/PaymentReceiveDrawer';

export default function DrawersContainer() {
  return (
    <div>
      <EstimateDrawer name={'estimate-drawer'} />
      <InvoiceDrawer name={'invoice-drawer'} />
      <ReceiptDrawer name={'receipt-drawer'} />
      <PaymentReceiveDrawer name={'payment-receive-drawer'} />
    </div>
  );
}
