import React from 'react';
import { useReceiptDrawerContext } from './ReceiptDrawerProvider';
import PaperTemplate from 'containers/Drawers/PaperTemplate/PaperTemplate';

export default function ReceiptPaper() {
  const { receipt, entries } = useReceiptDrawerContext();

  const propLabels = {
    labels: {
      name: 'Receipt',
      billedTo: 'Billed to',
      date: 'Receipt date',
      refNo: 'Receipt No.',
      billedFrom: 'Billed from',
      amount: 'Receipt amount',
      dueDate: 'Due date',
    },
  };

  const receipts = {
    billedTo: receipt.customer.display_name,
    date: receipt.receipt_date,
    amount: '',
    billedFrom: '',
    dueDate: receipt.due_date,
    referenceNo: receipt.receipt_number,
    ...receipt,
  };

  return (
    <PaperTemplate
      labels={propLabels.labels}
      paperData={receipts}
      entries={entries}
    />
  );
}
