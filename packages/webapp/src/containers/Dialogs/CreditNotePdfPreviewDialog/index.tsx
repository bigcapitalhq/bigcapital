// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { T, Dialog, DialogSuspense } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';

import { CLASSES } from '@/constants/classes';
import { flow } from 'fp-ts/function';

const PdfPreviewDialogContent = React.lazy(() =>
  import('./CreditNotePdfPreviewDialogContent').then((m) => ({
    default: m.CreditNotePdfPreviewDialogContent,
  })),
);

/**
 * Credit note PDF previwe dialog.
 */
function CreditNotePdfPreviewDialog({
  dialogName,
  payload = { creditNoteId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'credit_note_preview.dialog.title'} />}
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
export const index = flow(withDialogRedux())(
  CreditNotePdfPreviewDialog,
);
