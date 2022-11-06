// @ts-nocheck
import React from 'react';
import { CurrencyFormProvider } from './CurrencyFormProvider';

import CurrencyForm from './CurrencyForm';
import withCurrencyDetail from '@/containers/Currencies/withCurrencyDetail';

import { compose } from '@/utils';
import '@/style/pages/Currency/CurrencyFormDialog.scss';

function CurrencyFormDialogContent({
  // #ownProp
  action,
  currencyCode,
  dialogName,
}) {
  return (
    <CurrencyFormProvider
      isEditMode={action}
      currency={currencyCode}
      dialogName={dialogName}
    >
      <CurrencyForm />
    </CurrencyFormProvider>
  );
}

export default compose(withCurrencyDetail)(CurrencyFormDialogContent);
