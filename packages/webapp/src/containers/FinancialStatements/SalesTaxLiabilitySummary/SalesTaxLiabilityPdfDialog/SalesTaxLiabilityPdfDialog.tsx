import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const SalesTaxLiabilityPdfDialogContent = lazy(() =>
  import('./SalesTaxLiabilityPdfDialogContent').then((m) => ({
    default: m.SalesTaxLiabilityPdfDialogContent,
  })),
);

interface SalesTaxLiabilityPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Sales tax liability pdf preview dialog.
 */
function SalesTaxLiabilityPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: SalesTaxLiabilityPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Sales Tax Liability Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <SalesTaxLiabilityPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const SalesTaxLiabiltiyPdfDialog = compose(withDialogRedux())(
  SalesTaxLiabilityPdfDialogRoot,
);
