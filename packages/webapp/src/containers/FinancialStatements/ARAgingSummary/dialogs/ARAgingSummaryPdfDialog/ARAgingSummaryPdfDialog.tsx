import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

const ARAgingSummaryPdfDialogContent = lazy(() =>
  import('./ARAgingSummaryPdfDialogContent').then((m) => ({
    default: m.ARAgingSummaryPdfDialogContent,
  })),
);

interface ARAgingSummaryPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function ARAgingSummaryPdfDialogRoot({
  dialogName,
  isOpen,
}: ARAgingSummaryPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'A/R Aging Summary Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <ARAgingSummaryPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const ARAgingSummaryPdfDialog = compose(withDialogRedux())(
  ARAgingSummaryPdfDialogRoot,
);
