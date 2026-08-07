import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

const CashflowSheetPdfDialogContent = lazy(() =>
  import('./CashflowSheetPdfDialogContent').then((m) => ({
    default: m.CashflowSheetPdfDialogContent,
  })),
);

interface CashflowSheetPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function CashflowSheetPdfDialogRoot({
  dialogName,
  isOpen,
}: CashflowSheetPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Cashflow Sheet Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <CashflowSheetPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const CashflowSheetPdfDialog = compose(withDialogRedux())(
  CashflowSheetPdfDialogRoot,
);
