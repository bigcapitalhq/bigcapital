import React from 'react';
import { useReceiptDrawerContext } from './ReceiptDrawerProvider';
import PaperTemplate from '@/containers/Drawers/PaperTemplate/PaperTemplate';
import intl from 'react-intl-universal';

export default function ReceiptPaper() {
  const { receipt, entries } = useReceiptDrawerContext();

  const propLabels = {
    labels: {
      name: intl.get('receipt_'),
      billedTo: intl.get('billed_to'),
      date: intl.get('receipt_date_'),
      refNo: intl.get('receipt_no'),
      billedFrom: intl.get('billed_from'),
      amount: intl.get('receipt_amount'),
      dueDate: intl.get('due_date_'),
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
