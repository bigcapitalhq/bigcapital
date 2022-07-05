import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/SaleInvoice/PageForm.scss';

import InvoiceForm from './InvoiceForm';
import { InvoiceFormProvider } from './InvoiceFormProvider';

/**
 * Invoice form page.
 */
export default function InvoiceFormPage() {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <InvoiceFormProvider invoiceId={idAsInteger}>
      <InvoiceForm />
    </InvoiceFormProvider>
  );
}
