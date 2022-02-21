import React from 'react';
import { useParams } from 'react-router-dom';

import BillForm from './BillForm';
import { BillFormProvider } from './BillFormProvider';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

import 'style/pages/Bills/PageForm.scss';

function BillFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const billId = parseInt(id, 10);

  return (
    <BillFormProvider billId={billId} baseCurrency={base_currency}>
      <BillForm />
    </BillFormProvider>
  );
}
export default compose(withCurrentOrganization())(BillFormPage);
