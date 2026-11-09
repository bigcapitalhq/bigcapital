import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const InventorySummaryPdfDialogContent = lazy(() =>
  import('./InventorySummaryPdfDialogContent').then((m) => ({
    default: m.InventorySummaryPdfDialogContent,
  })),
);

interface InventorySummaryPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Inventory summary sheet pdf preview dialog.
 */
function InventorySummaryPdfDialogRoot({
  dialogName,
  isOpen,
}: InventorySummaryPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Inventory Summary Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <InventorySummaryPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const InventorySummaryPdfDialog = FF.pipe(
  InventorySummaryPdfDialogRoot,
  withDialogRedux(),
);
