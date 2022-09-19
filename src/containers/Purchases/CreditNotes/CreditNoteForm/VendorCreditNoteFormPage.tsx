// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/VendorsCreditNote/PageForm.scss';

import VendorCreditNoteForm from './VendorCreditNoteForm';
import { VendorCreditNoteFormProvider } from './VendorCreditNoteFormProvider';

/**
 * Vendor Credit note form pages.
 */
export default function VendorCreditNoteFormPage() {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <VendorCreditNoteFormProvider vendorCreditId={idAsInteger}>
      <VendorCreditNoteForm />
    </VendorCreditNoteFormProvider>
  );
}
