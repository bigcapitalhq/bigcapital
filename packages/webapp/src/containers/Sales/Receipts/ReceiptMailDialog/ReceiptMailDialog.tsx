// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReceiptMailDialogContent = React.lazy(
  () => import('./ReceiptMailDialogContent'),
);

/**
 * Invoice mail dialog.
 */
function ReceiptMailDialog({
  dialogName,
  payload: {
    receiptId = null,

    // Redirects to receipts list after mail submitting.
    redirectToReceiptsList = false,
  },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Receipt Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <ReceiptMailDialogContent
          dialogName={dialogName}
          receiptId={receiptId}
          redirectToReceiptsList={redirectToReceiptsList}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ReceiptMailDialog);
