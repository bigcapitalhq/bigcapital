import React from 'react';
import { useParams } from 'react-router-dom';

import '../../../../style/pages/VendorsCreditNote/PageForm.scss';

import VendorCreditNoteForm from './VendorCreditNoteForm';
import { VendorCreditNoteFormProvider } from './VendorCreditNoteFormProvider';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Vendor Credit note form pages.
 */
function VendorCreditNoteFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <VendorCreditNoteFormProvider
      vendorCreditId={idAsInteger}
      baseCurrency={base_currency}
    >
      <VendorCreditNoteForm />
    </VendorCreditNoteFormProvider>
  );
}
export default compose(withCurrentOrganization())(VendorCreditNoteFormPage);
