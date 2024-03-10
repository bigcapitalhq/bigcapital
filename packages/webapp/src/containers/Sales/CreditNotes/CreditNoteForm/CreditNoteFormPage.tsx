// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/CreditNote/PageForm.scss';

import CreditNoteForm from './CreditNoteForm';
import { CreditNoteFormProvider } from './CreditNoteFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Credit note form page.
 */
export default function CreditNoteFormPage() {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <CreditNoteFormProvider creditNoteId={idAsInteger}>
      <AutoExchangeRateProvider>
        <CreditNoteForm />
      </AutoExchangeRateProvider>
    </CreditNoteFormProvider>
  );
}
