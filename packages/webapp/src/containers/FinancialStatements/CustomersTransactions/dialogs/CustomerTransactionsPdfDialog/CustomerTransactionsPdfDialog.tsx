import React, { lazy } from 'react';
import classNames from 'classnames';

import { Dialog, DialogSuspense } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';

import { CLASSES } from '@/constants/classes';
import { flow } from 'fp-ts/function';

// Lazy loading the content.
const CustomerTransactionsPdfDialogContent = lazy(() =>
  import('./CustomerTransactionsPdfDialogContent').then((m) => ({
    default: m.CustomerTransactionsPdfDialogContent,
  })),
);

interface CustomerTransactionsPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Cashflow sheet pdf preview dialog.
 */
function CustomerTransactionsPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: CustomerTransactionsPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Customer Tranasctions PDF Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <CustomerTransactionsPdfDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const CustomerTransactionsPdfDialog = flow(withDialogRedux())(
  CustomerTransactionsPdfDialogRoot,
);
