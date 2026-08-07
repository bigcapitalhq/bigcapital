import React, { lazy } from 'react';
import type { CurrencyFormDialogPayload } from './types';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const CurrencyFormDialogContent = lazy(() =>
  import('./CurrencyFormDialogContent').then((m) => ({
    default: m.CurrencyFormDialogContent,
  })),
);

interface CurrencyFormDialogProps {
  dialogName: string;
  payload: CurrencyFormDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Currency form dialog.
 */
function CurrencyFormDialog({
  dialogName,
  payload = { action: '', id: null, currency: '' },
  isOpen,
}: CurrencyFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={
        payload.action === 'edit' ? (
          <T id={'edit_currency'} />
        ) : (
          <T id={'new_currency'} />
        )
      }
      className={'dialog--currency-form'}
      isOpen={isOpen}
      autoFocus={true}
      canEscapeKeyClose={true}
      style={{ width: '400px' }}
    >
      <DialogSuspense>
        <CurrencyFormDialogContent
          dialogName={dialogName}
          currencyCode={payload.currency}
          action={payload.action}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(CurrencyFormDialog);
