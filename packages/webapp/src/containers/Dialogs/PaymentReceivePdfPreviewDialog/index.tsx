import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const PdfPreviewDialogContent = React.lazy(() =>
  import('./PaymentReceivePdfPreviewContent').then((m) => ({
    default: m.PaymentReceivePdfPreviewContent,
  })),
);

interface PaymentReceivePdfPreviewDialogProps {
  dialogName: string;
  payload: { paymentReceiveId: number | null };
  isOpen: boolean | undefined;
}

/**
 * Payment receive PDF preview dialog.
 */
function PaymentReceivePdfPreviewDialog({
  dialogName,
  payload = { paymentReceiveId: null },
  isOpen,
}: PaymentReceivePdfPreviewDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'payment_received_preview.dialog.title'} />}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <PdfPreviewDialogContent
          dialogName={dialogName}
          subscriptionForm={payload}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = FF.pipe(PaymentReceivePdfPreviewDialog, withDialogRedux());
