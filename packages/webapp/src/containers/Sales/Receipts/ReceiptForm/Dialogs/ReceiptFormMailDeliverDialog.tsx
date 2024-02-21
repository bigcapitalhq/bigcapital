// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReceiptFormMailDeliverDialogContent = React.lazy(
  () => import('./ReceiptFormMailDeliverDialogContent'),
);

/**
 * Receipt mail dialog.
 */
function ReceiptFormMailDeliverDialog({
  dialogName,
  payload: { receiptId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Receipt Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={false}
      isCloseButtonShown={false}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <ReceiptFormMailDeliverDialogContent
          dialogName={dialogName}
          receiptId={receiptId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ReceiptFormMailDeliverDialog);
