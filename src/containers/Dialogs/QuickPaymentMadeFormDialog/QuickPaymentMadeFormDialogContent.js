import React from 'react';

import 'style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';

import { QuickPaymentMadeFormProvider } from './QuickPaymentMadeFormProvider';
import QuickPaymentMadeForm from './QuickPaymentMadeForm';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Quick payment made form dialog content.
 */
function QuickPaymentMadeFormDialogContent({
  // #ownProps
  dialogName,
  bill,
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  return (
    <QuickPaymentMadeFormProvider
      billId={bill}
      baseCurrency={base_currency}
      dialogName={dialogName}
    >
      <QuickPaymentMadeForm />
    </QuickPaymentMadeFormProvider>
  );
}

export default compose(withCurrentOrganization())(
  QuickPaymentMadeFormDialogContent,
);
