// @ts-nocheck
import React from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import withDialogRedux from '@/components/DialogReduxConnect';

import { compose } from '@/utils';

// Lazy loading the content.
const PdfPreviewDialogContent = React.lazy(() =>
  import('./ReceiptPdfPreviewDialogContent'),
);

/**
 * Receipt Pdf preview dialog.
 */
function ReceiptPdfPreviewDialog({
  dialogName,
  payload = { receiptId: null },
  isOpen,
}) {
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
          dialogName={dialogName}
          subscriptionForm={payload}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(ReceiptPdfPreviewDialog);
