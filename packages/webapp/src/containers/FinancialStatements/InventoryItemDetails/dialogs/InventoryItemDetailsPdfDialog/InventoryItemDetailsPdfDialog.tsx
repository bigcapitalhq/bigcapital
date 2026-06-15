import React, { lazy } from 'react';
import classNames from 'classnames';

import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { flow } from 'fp-ts/function';

// Lazy loading the content.
const InventoryItemDetailsPdfDialogContent = lazy(() =>
  import('./InventoryItemDetailsPdfDialogContent').then((m) => ({
    default: m.InventoryItemDetailsPdfDialogContent,
  })),
);

interface InventoryItemDetailsPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Inventory item details sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function InventoryItemDetailsPdfDialogRoot({
  dialogName,
  isOpen,
}: InventoryItemDetailsPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Inventory Item Details Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <InventoryItemDetailsPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const InventoryItemDetailsPdfDialog = flow(withDialogRedux())(
  InventoryItemDetailsPdfDialogRoot,
);
