import React from 'react';
import { useParams } from 'react-router-dom';

import InvoiceForm from './InvoiceForm';

import 'style/pages/SaleInvoice/PageForm.scss';
import { InvoiceFormProvider } from './InvoiceFormProvider';

/**
 * Invoice form page.
 */
export default function InvoiceFormPage() {
  const { id } = useParams();

  return (
    <InvoiceFormProvider invoiceId={id}>
      <InvoiceForm />
    </InvoiceFormProvider>
  );
}
