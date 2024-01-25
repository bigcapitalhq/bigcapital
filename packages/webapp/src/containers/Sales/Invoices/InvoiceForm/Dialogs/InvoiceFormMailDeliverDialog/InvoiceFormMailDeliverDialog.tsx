// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const InvoiceFormMailDeliverDialogContent = React.lazy(
  () => import('./InvoiceFormMailDeliverDialogContent'),
);

/**
 * Invoice mail dialog.
 */
function InvoiceFormMailDeliverDialog({
  dialogName,
  payload: { invoiceId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Invoice Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={false}
      isCloseButtonShown={false}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <InvoiceFormMailDeliverDialogContent
          dialogName={dialogName}
          invoiceId={invoiceId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(InvoiceFormMailDeliverDialog);
