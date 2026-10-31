import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

const InventoryTurnoverByAmountPdfDialogContent = lazy(() =>
  import('./InventoryTurnoverByAmountPdfDialogContent').then((m) => ({
    default: m.InventoryTurnoverByAmountPdfDialogContent,
  })),
);

interface InventoryTurnoverByAmountPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Inventory turnover by amount PDF preview dialog.
 */
function InventoryTurnoverByAmountPdfDialogRoot({
  dialogName,
  isOpen,
}: InventoryTurnoverByAmountPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Inventory Turnover By Amount Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <InventoryTurnoverByAmountPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const InventoryTurnoverByAmountPdfDialog = FF.pipe(
  InventoryTurnoverByAmountPdfDialogRoot,
  withDialogRedux(),
);
