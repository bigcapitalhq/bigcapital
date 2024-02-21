// @ts-nocheck
import React, { lazy } from 'react';
import classNames from 'classnames';

import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const PurchasesByItemsPdfDialogContent = lazy(
  () => import('./PurchasesByItemsPdfDialogContent'),
);

/**
 * Purchases by items sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function PurchasesByItemsPdfDialogRoot({ dialogName, payload, isOpen }) {
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
