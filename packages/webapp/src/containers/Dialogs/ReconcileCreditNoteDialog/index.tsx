import React from 'react';
import type { ReconcileCreditNoteDialogPayload } from './types';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReconcileCreditNoteDialogContent = React.lazy(() =>
  import('./ReconcileCreditNoteDialogContent').then((m) => ({
    default: m.ReconcileCreditNoteDialogContent,
  })),
);

interface ReconcileCreditNoteDialogProps {
  dialogName: string;
  payload: ReconcileCreditNoteDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Reconcile credit note dialog.
 */
function ReconcileCreditNoteDialog({
  dialogName,
  payload: { creditNoteId } = {},
  isOpen,
}: ReconcileCreditNoteDialogProps): React.ReactElement {
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
          creditNoteId={creditNoteId ?? null}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(ReconcileCreditNoteDialog);
