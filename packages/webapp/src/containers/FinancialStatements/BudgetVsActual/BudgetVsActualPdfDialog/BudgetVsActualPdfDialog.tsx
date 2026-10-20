import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const BudgetVsActualPdfDialogContent = lazy(() =>
  import('./BudgetVsActualPdfDialogContent').then((m) => ({
    default: m.BudgetVsActualPdfDialogContent,
  })),
);

interface BudgetVsActualPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Budget vs actual pdf preview dialog.
 */
function BudgetVsActualPdfDialogRoot({
  dialogName,
  payload: _payload,
  isOpen,
}: BudgetVsActualPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Budget vs Actual Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <BudgetVsActualPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const BudgetVsActualPdfDialog = FF.pipe(
  BudgetVsActualPdfDialogRoot,
  withDialogRedux(),
);
