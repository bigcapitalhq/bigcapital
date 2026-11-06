import React from 'react';
import { useParams } from 'react-router-dom';
import { RecurringInvoiceForm } from './RecurringInvoiceForm';
import { RecurringInvoiceFormProvider } from './RecurringInvoiceFormProvider';

export function RecurringInvoiceFormPage() {
  const { id } = useParams<{ id?: string }>();
  const recurringInvoiceId = id ? parseInt(id, 10) : undefined;

  return (
    <RecurringInvoiceFormProvider recurringInvoiceId={recurringInvoiceId}>
      <RecurringInvoiceForm />
    </RecurringInvoiceFormProvider>
  );
}
