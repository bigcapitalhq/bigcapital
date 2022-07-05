import React from 'react';
import { useInvoiceDrawerContext } from './InvoiceDrawerProvider';
import PaperTemplate from '@/containers/Drawers/PaperTemplate/PaperTemplate';
import intl from 'react-intl-universal';

export default function InvoicePaper() {
  const { invoice, entries } = useInvoiceDrawerContext();

  const propLabels = {
    labels: {
      name: intl.get('invoice'),
      billedTo: intl.get('billed_to'),
      date: intl.get('invoice_date_'),
      refNo: intl.get('invoice_no__'),
      billedFrom: intl.get('billed_from'),
      amount: intl.get('invoice_amount'),
      dueDate: intl.get('due_date_'),
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
