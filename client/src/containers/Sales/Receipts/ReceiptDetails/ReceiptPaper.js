import React from 'react';
import { useReceiptDrawerContext } from './ReceiptDrawerProvider';
import PaperTemplate from 'containers/Drawers/PaperTemplate/PaperTemplate';
import { formatMessage } from 'services/intl';

export default function ReceiptPaper() {
  const { receipt, entries } = useReceiptDrawerContext();

  const propLabels = {
    labels: {
      name: formatMessage({ id: 'receipt_' }),
      billedTo: formatMessage({ id: 'billed_to' }),
      date: formatMessage({ id: 'receipt_date_' }),
      refNo: formatMessage({ id: 'receipt_no' }),
      billedFrom: formatMessage({ id: 'billed_from' }),
      amount: formatMessage({ id: 'receipt_amount' }),
      dueDate: formatMessage({ id: 'due_date_' }),
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
