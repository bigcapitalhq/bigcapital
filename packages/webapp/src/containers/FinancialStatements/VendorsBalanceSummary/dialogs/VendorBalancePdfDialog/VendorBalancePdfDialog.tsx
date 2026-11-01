import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const VendorBalancePdfDialogContent = lazy(() =>
  import('./VendorBalancePdfDialogContent').then((m) => ({
    default: m.VendorBalancePdfDialogContent,
  })),
);

interface VendorBalancePdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Vendor balance sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function VendorBalancePdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: VendorBalancePdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Vendor Balance Summary Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <VendorBalancePdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const VendorBalancePdfDialog = FF.pipe(
  VendorBalancePdfDialogRoot,
  withDialogRedux(),
);
