import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const SalesByItemsPdfDialogContent = lazy(() =>
  import('./SalesByItemsPdfDialogContent').then((m) => ({
    default: m.SalesByItemsPdfDialogContent,
  })),
);

interface SalesByItemsPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Sales by items sheet pdf preview dialog.
 */
function SalesByItemsPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: SalesByItemsPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Sales By Items Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <SalesByItemsPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const SalesByItemsPdfDialog = compose(withDialogRedux())(
  SalesByItemsPdfDialogRoot,
);
