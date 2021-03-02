import React from 'react';

import ExchangeRateForm from './ExchangeRateForm';
import { ExchangeRateFormProvider } from './ExchangeRateFormProvider';

import withExchangeRateDetail from 'containers/ExchangeRates/withExchangeRateDetail';
import { compose } from 'utils';

import 'style/pages/ExchangeRate/ExchangeRateDialog.scss';

/**
 * Exchange rate form content.
 */
export default function ExchangeRateFormDialogContent({
  // #ownProp
  action,
  exchangeRateId,
  dialogName,
}) {
  return (
    <ExchangeRateFormProvider
      dialogName={dialogName}
      exchangeRate={exchangeRateId}
      action={action}
    >
      <ExchangeRateForm />
    </ExchangeRateFormProvider>
  );
}
