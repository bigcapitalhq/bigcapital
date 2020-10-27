import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const ReceiptNumberDialogContent = lazy(() =>
  import('./ReceiptNumberDialogContent'),
);

function ReceiptNumberDialog({ dialogName, paylaod = { id: null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'receipt_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <ReceiptNumberDialogContent ReceiptNumberId={paylaod.id} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ReceiptNumberDialog);
