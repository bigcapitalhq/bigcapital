// @ts-nocheck
import React from 'react';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReconcileCreditNoteDialogContent = React.lazy(() =>
  import('./ReconcileCreditNoteDialogContent'),
);

/**
 * Reconcile credit note dialog.
 */
function ReconcileCreditNoteDialog({
  dialogName,
  payload: { creditNoteId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'reconcile_credit_note.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className="dialog--reconcile-credit-form"
    >
      <DialogSuspense>
        <ReconcileCreditNoteDialogContent
          creditNoteId={creditNoteId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ReconcileCreditNoteDialog);
