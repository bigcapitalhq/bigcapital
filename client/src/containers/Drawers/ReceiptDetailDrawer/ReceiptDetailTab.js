import React from 'react';
import ReceiptDetailActionBar from './ReceiptDetailActionBar';
import ReceiptDetailHeader from './ReceiptDetailHeader';
import ReceiptDetailTable from './ReceiptDetailTable';

export default function ReceiptDetailTab() {
  return (
    <div>
      <ReceiptDetailActionBar />
      <ReceiptDetailHeader />
      <ReceiptDetailTable />
    </div>
  );
}
