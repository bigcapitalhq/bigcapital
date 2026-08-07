import React from 'react';
import '@/style/pages/Currency/CurrencyFormDialog.scss';
import { CurrencyForm } from './CurrencyForm';
import { CurrencyFormProvider } from './CurrencyFormProvider';

interface CurrencyFormDialogContentInnerProps {
  action?: string;
  currencyCode?: string;
  dialogName: string;
}

function CurrencyFormDialogContentInner({
  action,
  currencyCode,
  dialogName,
}: CurrencyFormDialogContentInnerProps): React.ReactElement {
  return (
    <CurrencyFormProvider
      // FIXME: `isEditMode` receives the action string, not a boolean —
      // consumers truthy-check it, so behavior is preserved.
      isEditMode={action ?? false}
      currency={currencyCode}
      dialogName={dialogName}
    >
      <CurrencyForm />
    </CurrencyFormProvider>
  );
}

export const CurrencyFormDialogContent = CurrencyFormDialogContentInner;
