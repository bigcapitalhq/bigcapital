// @ts-nocheck
import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const CurrencyFormDialogContent = lazy(() =>
  import('./CurrencyFormDialogContent'),
);

/**
 * Currency form dialog.
 */
function CurrencyFormDialog({
  dialogName,
  payload = { action: '', id: null, currency: '' },
  isOpen,
}) {
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

export default compose(withDialogRedux())(CurrencyFormDialog);
