// @ts-nocheck
import React, { lazy } from 'react';
import classNames from 'classnames';

import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const InventoryValuationPdfDialogContent = lazy(
  () => import('./InventoryValuationSheetPdfDialogContent'),
);

/**
 * Inventory valuation sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function InventoryValuationSheetPdfDialogRoot({ dialogName, payload, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'Inventory Valuation Sheet Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <InventoryValuationPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const InventoryValuationPdfDialog = compose(withDialogRedux())(
  InventoryValuationSheetPdfDialogRoot,
);
