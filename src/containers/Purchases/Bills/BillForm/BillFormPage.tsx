// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import BillForm from './BillForm';
import { BillFormProvider } from './BillFormProvider';

import '@/style/pages/Bills/PageForm.scss';

export default function BillFormPage() {
  const { id } = useParams();
  const billId = parseInt(id, 10);

  return (
    <BillFormProvider billId={billId}>
      <BillForm />
    </BillFormProvider>
  );
}
