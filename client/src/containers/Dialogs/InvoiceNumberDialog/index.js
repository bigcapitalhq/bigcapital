import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const InvoiceNumberDialogContent = lazy(() =>
  import('./InvoiceNumberDialogContent'),
);

function InvoiceNumberDialog({ dialogName, payload = { id: null }, isOpen }) {
  return (
    <Dialog
    title={<T id={'invoice_number_settings'} />}
    name={dialogName}
    autoFocus={true}
    canEscapeKeyClose={true}
    isOpen={isOpen}
    >
      <DialogSuspense>
        <InvoiceNumberDialogContent InvoiceNumberId={payload.id} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(InvoiceNumberDialog);
