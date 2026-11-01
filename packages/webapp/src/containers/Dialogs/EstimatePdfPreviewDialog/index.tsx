import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React from 'react';
import { T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const PdfPreviewDialogContent = React.lazy(() =>
  import('./EstimatePdfPreviewDialogContent').then((m) => ({
    default: m.EstimatePdfPreviewDialogContent,
  })),
);

interface EstimatePdfPreviewDialogProps {
  dialogName: string;
  payload: { estimateId: number | null };
  isOpen: boolean | undefined;
}

/**
 * Estimate PDF preview dialog.
 */
function EstimatePdfPreviewDialog({
  dialogName,
  payload = { estimateId: null },
  isOpen,
}: EstimatePdfPreviewDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'estimate_preview.dialog.title'} />}
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

export const index = FF.pipe(EstimatePdfPreviewDialog, withDialogRedux());
