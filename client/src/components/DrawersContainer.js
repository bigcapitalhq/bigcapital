import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimate/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoice/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipt/ReceiptDrawer';

export default function DrawersContainer() {
  return (
    <div>
      <EstimateDrawer name={'estimate-drawer'} />
      <InvoiceDrawer name={'invoice-drawer'} />
      <ReceiptDrawer name={'receipt-drawer'} />
    </div>
  );
}
