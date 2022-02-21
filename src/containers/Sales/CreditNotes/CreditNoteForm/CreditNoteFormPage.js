import React from 'react';
import { useParams } from 'react-router-dom';

import '../../../../style/pages/CreditNote/PageForm.scss';

import CreditNoteForm from './CreditNoteForm';
import { CreditNoteFormProvider } from './CreditNoteFormProvider';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Credit note form page.
 */
function CreditNoteFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

  return (
    <CreditNoteFormProvider
      creditNoteId={idAsInteger}
      baseCurrency={base_currency}
    >
      <CreditNoteForm />
    </CreditNoteFormProvider>
  );
}

export default compose(withCurrentOrganization())(CreditNoteFormPage);
