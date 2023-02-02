// @ts-nocheck
import React, { lazy } from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const QuickPaymentReceiveFormDialogContent = lazy(
  () => import('./QuickPaymentReceiveFormDialogContent'),
);

/**
 * Quick payment receive form dialog.
 */
function QuickPaymentReceiveFormDialog({
  dialogName,
  payload = { invoiceId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_receive_payment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--quick-payment-receive'}
    >
      <DialogSuspense>
        <QuickPaymentReceiveFormDialogContent
          dialogName={dialogName}
          invoice={payload.invoiceId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(QuickPaymentReceiveFormDialog);
