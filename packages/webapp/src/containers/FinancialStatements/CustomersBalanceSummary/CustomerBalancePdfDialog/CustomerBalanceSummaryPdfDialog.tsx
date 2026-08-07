import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const CustomerBalanceSummaryPdfDialogContent = lazy(() =>
  import('./CustomerBalanceSummaryPdfDialogContent').then((m) => ({
    default: m.CustomerBalanceSummaryPdfDialogContent,
  })),
);

interface CustomerBalanceSummaryPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

function CashflowSheetPdfDialogRoot({
  dialogName,
  isOpen,
}: CustomerBalanceSummaryPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Customer Balance Summary Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <CustomerBalanceSummaryPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const CustomerBalanceSummaryPdfDialog = compose(withDialogRedux())(
  CashflowSheetPdfDialogRoot,
);
