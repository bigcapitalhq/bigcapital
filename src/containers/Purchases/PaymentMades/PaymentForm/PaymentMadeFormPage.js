import React from 'react';
import { useParams } from 'react-router-dom';

import PaymentMadeForm from './PaymentMadeForm';
import { PaymentMadeFormProvider } from './PaymentMadeFormProvider';

import 'style/pages/PaymentMade/PageForm.scss';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Payment made - Page form.
 */
function PaymentMadeFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id: paymentMadeId } = useParams();

  return (
    <PaymentMadeFormProvider
      paymentMadeId={paymentMadeId}
      baseCurrency={base_currency}
    >
      <PaymentMadeForm />
    </PaymentMadeFormProvider>
  );
}
export default compose(withCurrentOrganization())(PaymentMadeFormPage);
