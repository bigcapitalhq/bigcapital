import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const PurchasesByItemsPdfDialogContent = lazy(() =>
  import('./PurchasesByItemsPdfDialogContent').then((m) => ({
    default: m.PurchasesByItemsPdfDialogContent,
  })),
);

interface PurchasesByItemsPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Purchases by items sheet pdf preview dialog.
 */
function PurchasesByItemsPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: PurchasesByItemsPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Purchases By Items Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <PurchasesByItemsPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const PurchasesByItemsPdfDialog = compose(withDialogRedux())(
  PurchasesByItemsPdfDialogRoot,
);
