import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

const ProfitLossSheetPdfDialogContent = lazy(() =>
  import('./ProfitLossSheetPdfDialogContent').then((mod) => ({
    default: mod.ProfitLossSheetPdfDialogContent,
  })),
);

interface ProfitLossSheetPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function ProfitLossSheetPdfDialogRoot({
  dialogName,
  isOpen,
  payload,
}: ProfitLossSheetPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Profit/LossSheet Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <ProfitLossSheetPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const ProfitLossSheetPdfDialog = compose(withDialogRedux())(
  ProfitLossSheetPdfDialogRoot,
);
