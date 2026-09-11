import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';

// Lazy loading the content.
const GeneralLedgerPdfDialogContent = lazy(() =>
  import('./GeneralLedgerPdfDialogContent').then((m) => ({
    default: m.GeneralLedgerPdfDialogContent,
  })),
);

interface GeneralLedgerPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * General ledger pdf preview dialog.
 * @returns {React.ReactNode}
 */
function GeneralLedgerPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: GeneralLedgerPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'General Ledger PDF Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <GeneralLedgerPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const GeneralLedgerPdfDialog = FF.pipe(
  GeneralLedgerPdfDialogRoot,
  withDialogRedux(),
);
