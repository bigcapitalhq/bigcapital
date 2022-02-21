import React from 'react';
import { useParams } from 'react-router-dom';

import { PaymentReceiveFormProvider } from './PaymentReceiveFormProvider';
import PaymentReceiveForm from './PaymentReceiveForm';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';
/**
 * Payment receive form page.
 */
function PaymentReceiveFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id: paymentReceiveId } = useParams();
  const paymentReceiveIdInt = parseInt(paymentReceiveId, 10);

  return (
    <PaymentReceiveFormProvider
      paymentReceiveId={paymentReceiveIdInt}
      baseCurrency={base_currency}
    >
      <PaymentReceiveForm paymentReceiveId={paymentReceiveIdInt} />
    </PaymentReceiveFormProvider>
  );
}
export default compose(withCurrentOrganization())(PaymentReceiveFormPage);
