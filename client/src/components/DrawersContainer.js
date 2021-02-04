import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimate/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoice/InvoiceDrawer';

export default function DrawersContainer() {
  return (
    <div>
      <EstimateDrawer name={'estimate-drawer'} />
      <InvoiceDrawer name={'invoice-drawer'} />
    </div>
  );
}
