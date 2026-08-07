import classNames from 'classnames';
import React from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const PdfPreviewDialogContent = React.lazy(() =>
  import('./ReceiptPdfPreviewDialogContent').then((m) => ({
    default: m.ReceiptPdfPreviewDialogContent,
  })),
);

interface ReceiptPdfPreviewDialogProps {
  dialogName: string;
  payload: { receiptId: number | null };
  isOpen: boolean | undefined;
}

/**
 * Receipt Pdf preview dialog.
 */
function ReceiptPdfPreviewDialog({
  dialogName,
  payload = { receiptId: null },
  isOpen,
}: ReceiptPdfPreviewDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'receipt_preview.dialog.title'} />}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <PdfPreviewDialogContent
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          dialogName={dialogName}
          subscriptionForm={payload}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(ReceiptPdfPreviewDialog);
