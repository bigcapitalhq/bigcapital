import React from 'react';

import 'style/pages/PaymentReceive/QuickPaymentReceiveDialog.scss';

import QuickPaymentReceiveForm from './QuickPaymentReceiveForm';
import { QuickPaymentReceiveFormProvider } from './QuickPaymentReceiveFormProvider';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Quick payment receive form dialog content.
 */
function QuickPaymentReceiveFormDialogContent({
  // #ownProps
  dialogName,
  invoice,
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  return (
    <QuickPaymentReceiveFormProvider
      invoiceId={invoice}
      dialogName={dialogName}
      baseCurrency={base_currency}
    >
      <QuickPaymentReceiveForm />
    </QuickPaymentReceiveFormProvider>
  );
}
export default compose(withCurrentOrganization())(
  QuickPaymentReceiveFormDialogContent,
);
