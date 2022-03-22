import React from 'react';

import CustomerOpeningBalanceForm from './CustomerOpeningBalanceForm';
import { CustomerOpeningBalanceFormProvider } from './CustomerOpeningBalanceFormProvider';

/**
 * Customer opening balance dialog content.
 * @returns
 */
export default function CustomerOpeningBalanceDialogContent({
  // #ownProps
  dialogName,
  customerId,
}) {
  return (
    <CustomerOpeningBalanceFormProvider
      customerId={customerId}
      dialogName={dialogName}
    >
      <CustomerOpeningBalanceForm />
    </CustomerOpeningBalanceFormProvider>
  );
}
