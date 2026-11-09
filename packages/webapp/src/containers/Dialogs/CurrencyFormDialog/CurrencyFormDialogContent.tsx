import React from 'react';
import '@/style/pages/Currency/CurrencyFormDialog.scss';
import { CurrencyForm } from './CurrencyForm';
import { CurrencyFormProvider } from './CurrencyFormProvider';
import type { Currency } from '@bigcapital/sdk-ts';

interface CurrencyFormDialogContentInnerProps {
  action?: string;
  currency?: Currency;
  dialogName: string;
}

function CurrencyFormDialogContentInner({
  action,
  currency,
  dialogName,
}: CurrencyFormDialogContentInnerProps): React.ReactElement {
  return (
    <CurrencyFormProvider
      isEditMode={action === 'edit'}
      currency={currency}
      dialogName={dialogName}
    >
      <CurrencyForm />
    </CurrencyFormProvider>
  );
}

export const CurrencyFormDialogContent = CurrencyFormDialogContentInner;
