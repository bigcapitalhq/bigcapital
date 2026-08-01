import React from 'react';
import '@/style/pages/Currency/CurrencyFormDialog.scss';
import { CurrencyForm } from './CurrencyForm';
import { CurrencyFormProvider } from './CurrencyFormProvider';
import type { WithCurrencyDetailProps } from '@/containers/Currencies/withCurrencyDetail';
import { withCurrencyDetail } from '@/containers/Currencies/withCurrencyDetail';
import { compose } from '@/utils';

interface CurrencyFormDialogContentInnerProps extends WithCurrencyDetailProps {
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

export const CurrencyFormDialogContent = compose(withCurrencyDetail)(
  CurrencyFormDialogContentInner,
);
