import React, { lazy } from 'react';
import classNames from 'classnames';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { flow } from 'fp-ts/function';

// Lazy loading the content.
const BalanceSheetPdfDialogContent = lazy(() =>
  import('./BalanceSheetPdfDialogContent').then((m) => ({
    default: m.BalanceSheetPdfDialogContent,
  })),
);

/**
 * Balance sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
interface BalanceSheetPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function BalanceSheetPdfDialogRoot({
  dialogName,
  isOpen,
}: BalanceSheetPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Balance Sheet Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <BalanceSheetPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const BalanceSheetPdfDialog = flow(withDialogRedux())(
  BalanceSheetPdfDialogRoot,
);
