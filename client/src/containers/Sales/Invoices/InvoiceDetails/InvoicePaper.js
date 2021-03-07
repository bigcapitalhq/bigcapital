import React from 'react';
import { useInvoiceDrawerContext } from './InvoiceDrawerProvider';
import PaperTemplate from 'containers/Drawers/PaperTemplate/PaperTemplate';

export default function InvoicePaper() {
  const { invoice, entries } = useInvoiceDrawerContext();

  const propLabels = {
    labels: {
      name: 'Invoice',
      billedTo: 'Billed to',
      date: 'Invoice date',
      refNo: 'Invoice No.',
      billedFrom: 'Billed from',
      amount: 'Invoice amount',
      dueDate: 'Due date',
    },
  };

  const defaultValues = {
    billedTo: invoice.customer.display_name,
    date: invoice.invoice_date,
    amount: invoice.balance,
    billedFrom: '',
    dueDate: invoice.due_date,
    referenceNo: invoice.invoice_no,
    ...invoice,
  };

  return (
    <PaperTemplate
      labels={propLabels.labels}
      paperData={defaultValues}
      entries={entries}
    />
  );
}
