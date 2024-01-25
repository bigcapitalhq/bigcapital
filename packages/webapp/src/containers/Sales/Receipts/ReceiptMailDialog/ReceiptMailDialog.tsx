// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReceiptMailDialogBody = React.lazy(
  () => import('./ReceiptMailDialogBody'),
);

/**
 * Receipt mail dialog.
 */
function ReceiptMailDialog({
  dialogName,
  payload: { receiptId = null },
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
        <ReceiptMailDialogBody receiptId={receiptId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ReceiptMailDialog);
