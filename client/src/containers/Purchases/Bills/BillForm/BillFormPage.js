import React from 'react';
import { useParams } from 'react-router-dom';

import BillForm from './BillForm';
import { BillFormProvider } from './BillFormProvider';

import 'style/pages/Bills/PageForm.scss';

export default function BillFormPage() {
  const { id } = useParams();
  const idInt = parseInt(id, 10);

  return (
    <BillFormProvider billId={idInt}>
      <BillForm />
    </BillFormProvider>
  );
}