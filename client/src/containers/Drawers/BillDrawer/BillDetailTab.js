import React from 'react';
import BillDetailActionsBar from './BillDetailActionsBar';
import BillDetailHeader from './BillDetailHeader';
import BillDetailTable from './BillDetailTable';

export default function BillDetailTab() {
  return (
    <div>
      <BillDetailActionsBar />
      <BillDetailHeader />
      <BillDetailTable />
    </div>
  );
}
