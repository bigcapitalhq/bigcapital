import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose, saveInvoke } from 'utils';

const InvoiceNumberDialogContent = lazy(() =>
  import('./InvoiceNumberDialogContent'),
);

function InvoiceNumberDialog({
  dialogName,
  payload = { id: null },
  isOpen,
  onConfirm,
}) {

  return (
    <Dialog
    title={<T id={'invoice_number_settings'} />}
    name={dialogName}
    autoFocus={true}
    canEscapeKeyClose={true}
    isOpen={isOpen}
    >
      <DialogSuspense>
        <InvoiceNumberDialogContent
          InvoiceNumberId={payload.id}
          onConfirm={(values) => saveInvoke(onConfirm, values)} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(InvoiceNumberDialog);
