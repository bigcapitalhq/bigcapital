import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/SaleInvoice/PageForm.scss';

import InvoiceForm from './InvoiceForm';
import { InvoiceFormProvider } from './InvoiceFormProvider';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Invoice form page.
 */
function InvoiceFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <InvoiceFormProvider invoiceId={idAsInteger} baseCurrency={base_currency}>
      <InvoiceForm />
    </InvoiceFormProvider>
  );
}
export default compose(withCurrentOrganization())(InvoiceFormPage);
