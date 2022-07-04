import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'redux';

const QuickPaymentMadeFormDialogContent = lazy(() =>
  import('./QuickPaymentMadeFormDialogContent'),
);

/**
 * Quick payment made form dialog.
 */
function QuickPaymentMadeFormDialog({
  dialogName,
  payload = { billId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_made_payment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--quick-payment-receive'}
    >
      <DialogSuspense>
        <QuickPaymentMadeFormDialogContent
          bill={payload.billId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(QuickPaymentMadeFormDialog);
