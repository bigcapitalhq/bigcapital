// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { T, Dialog, DialogSuspense } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';

import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const PdfPreviewDialogContent = React.lazy(() =>
  import('./PaymentReceivePdfPreviewContent'),
);

/**
 * Payment receive PDF preview dialog.
 */
function PaymentReceivePdfPreviewDialog({
  dialogName,
  payload = { paymentReceiveId: null },
  isOpen,
}) {
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

export default compose(withDialogRedux())(PaymentReceivePdfPreviewDialog);
