import React from 'react';
import { useParams } from 'react-router-dom';
import { BillForm } from './BillForm';
import { BillFormProvider } from './BillFormProvider';

import '@/style/pages/Bills/PageForm.scss';

export function BillFormPage() {
  const { id } = useParams<{ id?: string }>();
  const billId = id ? parseInt(id, 10) : undefined;

  return (
    <BillFormProvider billId={billId}>
      <BillForm />
    </BillFormProvider>
  );
}
