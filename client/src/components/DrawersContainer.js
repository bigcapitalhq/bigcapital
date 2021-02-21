import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimate/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoice/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipt/ReceiptDrawer';
import PaymentReceive from 'containers/Sales/PaymentReceive/PaymentReceiveDrawer';

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
