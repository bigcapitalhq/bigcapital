import React from 'react';
import InvoiceDetailActionsBar from './InvoiceDetailActionsBar';
import InvoiceDetailHeader from './InvoiceDetailHeader';
import InvoiceDetailTable from './InvoiceDetailTable';

function InvoiceDetailTab() {
  return (
    <div>
      <InvoiceDetailActionsBar />
      <InvoiceDetailHeader />
      <InvoiceDetailTable />
    </div>
  );
}

export default InvoiceDetailTab;
