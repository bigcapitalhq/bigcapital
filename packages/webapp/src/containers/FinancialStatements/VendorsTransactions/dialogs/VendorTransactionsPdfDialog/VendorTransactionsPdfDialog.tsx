import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const VendorTransactionsPdfDialogContent = lazy(() =>
  import('./VendorTransactionsPdfDialogContent').then((m) => ({
    default: m.VendorTransactionsPdfDialogContent,
  })),
);

interface VendorTransactionsPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Vendor transactions pdf preview dialog.
 * @returns {React.ReactNode}
 */
function VendorTransactionsPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: VendorTransactionsPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Vendor Transactions Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <VendorTransactionsPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const VendorTransactionsPdfDialog = FF.pipe(
  VendorTransactionsPdfDialogRoot,
  withDialogRedux(),
);
