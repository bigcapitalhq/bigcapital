// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const ReceiptFormMailDeliverDialogContent = React.lazy(() =>
  import('./ReceiptFormMailDeliverDialogContent').then((m) => ({
    default: m.ReceiptFormMailDeliverDialogContent,
  })),
);

/**
 * Receipt mail dialog.
 */
function ReceiptFormMailDeliverDialogInner({
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

export const ReceiptFormMailDeliverDialog = flow(withDialogRedux())(
  ReceiptFormMailDeliverDialogInner,
);
