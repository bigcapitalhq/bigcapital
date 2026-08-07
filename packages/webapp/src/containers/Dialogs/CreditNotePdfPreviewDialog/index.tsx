import classNames from 'classnames';
import React from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

const PdfPreviewDialogContent = React.lazy(() =>
  import('./CreditNotePdfPreviewDialogContent').then((m) => ({
    default: m.CreditNotePdfPreviewDialogContent,
  })),
);

interface CreditNotePdfPreviewDialogProps {
  dialogName: string;
  payload: { creditNoteId: number | string | null };
  isOpen: boolean | undefined;
}

/**
 * Credit note PDF previwe dialog.
 */
function CreditNotePdfPreviewDialog({
  dialogName,
  payload = { creditNoteId: null },
  isOpen,
}: CreditNotePdfPreviewDialogProps): React.ReactElement {
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
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          dialogName={dialogName}
          subscriptionForm={payload}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(CreditNotePdfPreviewDialog);
