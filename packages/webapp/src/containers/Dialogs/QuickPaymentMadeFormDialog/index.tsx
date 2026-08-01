import React, { lazy } from 'react';
import type { QuickPaymentMadeDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const QuickPaymentMadeFormDialogContent = lazy(() =>
  import('./QuickPaymentMadeFormDialogContent').then((m) => ({
    default: m.QuickPaymentMadeFormDialogContent,
  })),
);

interface QuickPaymentMadeFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: QuickPaymentMadeDialogPayload;
}

/**
 * Quick payment made form dialog.
 */
function QuickPaymentMadeFormDialog({
  dialogName,
  payload = { billId: null },
  isOpen,
}: QuickPaymentMadeFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_made_payment'} />}
      isOpen={isOpen}
      // FIXME: typo `canEscapeJeyClose` preserved from @ts-nocheck original.
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

export const index = compose(withDialogRedux())(QuickPaymentMadeFormDialog);
