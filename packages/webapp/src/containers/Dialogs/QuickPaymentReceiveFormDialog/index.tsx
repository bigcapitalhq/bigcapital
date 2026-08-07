import React, { lazy } from 'react';
import type { QuickPaymentReceiveDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const QuickPaymentReceiveFormDialogContent = lazy(() =>
  import('./QuickPaymentReceiveFormDialogContent').then((m) => ({
    default: m.QuickPaymentReceiveFormDialogContent,
  })),
);

interface QuickPaymentReceiveFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: QuickPaymentReceiveDialogPayload;
}

/**
 * Quick payment receive form dialog.
 */
function QuickPaymentReceiveFormDialog({
  dialogName,
  payload = { invoiceId: null },
  isOpen,
}: QuickPaymentReceiveFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_receive_payment'} />}
      isOpen={isOpen}
      // FIXME: typo `canEscapeJeyClose` preserved from @ts-nocheck original.
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

export const index = compose(withDialogRedux())(QuickPaymentReceiveFormDialog);
