import React, { lazy } from 'react';
import classNames from 'classnames';

import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { flow } from 'fp-ts/function';

const APAgingSummaryPdfDialogContent = lazy(() =>
  import('./APAgingSummaryPdfDialogContent').then((m) => ({
    default: m.APAgingSummaryPdfDialogContent,
  })),
);

interface APAgingSummaryPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function APAgingSummaryPdfDialogRoot({
  dialogName,
  isOpen,
}: APAgingSummaryPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'A/P Aging Summary Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <APAgingSummaryPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const APAgingSummaryPdfDialog = flow(withDialogRedux())(
  APAgingSummaryPdfDialogRoot,
);
