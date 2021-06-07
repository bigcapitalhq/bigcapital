import React from 'react';
import { useInvoiceDrawerContext } from './InvoiceDrawerProvider';
import PaperTemplate from 'containers/Drawers/PaperTemplate/PaperTemplate';
import { formatMessage } from 'services/intl';

export default function InvoicePaper() {
  const { invoice, entries } = useInvoiceDrawerContext();

  const propLabels = {
    labels: {
      name: formatMessage({ id: 'invoice' }),
      billedTo: formatMessage({ id: 'billed_to' }),
      date: formatMessage({ id: 'invoice_date_' }),
      refNo: formatMessage({ id: 'invoice_no__' }),
      billedFrom: formatMessage({ id: 'billed_from' }),
      amount: formatMessage({ id: 'invoice_amount' }),
      dueDate: formatMessage({ id: 'due_date_' }),
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
