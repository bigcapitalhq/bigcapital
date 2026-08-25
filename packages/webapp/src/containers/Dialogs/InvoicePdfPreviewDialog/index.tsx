import classNames from 'classnames';
import React, { lazy } from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const PdfPreviewDialogContent = lazy(() =>
  import('./InvoicePdfPreviewDialogContent').then((m) => ({
    default: m.InvoicePdfPreviewDialogContent,
  })),
);

interface InvoicePdfPreviewDialogProps {
  dialogName: string;
  payload: { invoiceId: number | null };
  isOpen: boolean | undefined;
}

/**
 * Invoice PDF preview dialog.
 */
function InvoicePdfPreviewDialog({
  dialogName,
  payload,
  isOpen,
}: InvoicePdfPreviewDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'invoice_preview.dialog.title'} />}
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

export const index = compose(withDialogRedux())(InvoicePdfPreviewDialog);
