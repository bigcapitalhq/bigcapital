// @ts-nocheck
import React from 'react';
import { CurrencyFormProvider } from './CurrencyFormProvider';

import { CurrencyForm } from './CurrencyForm';
import { withCurrencyDetail } from '@/containers/Currencies/withCurrencyDetail';
import { flow } from 'fp-ts/function';

import '@/style/pages/Currency/CurrencyFormDialog.scss';

function CurrencyFormDialogContentInner({
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

export const CurrencyFormDialogContent = flow(withCurrencyDetail)(
  CurrencyFormDialogContentInner,
);
