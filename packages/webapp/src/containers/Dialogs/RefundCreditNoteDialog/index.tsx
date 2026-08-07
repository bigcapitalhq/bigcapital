import React from 'react';
import type { RefundCreditNoteDialogPayload } from './types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const RefundCreditNoteDialogContent = React.lazy(() =>
  import('./RefundCreditNoteDialogContent').then((m) => ({
    default: m.RefundCreditNoteDialogContent,
  })),
);

interface RefundCreditNoteDialogProps {
  dialogName: string;
  payload: RefundCreditNoteDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Refund credit note dialog.
 */
function RefundCreditNoteDialog({
  dialogName,
  payload: { creditNoteId } = {},
  isOpen,
}: RefundCreditNoteDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'refund_credit_note.dialog.label'} />}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--refund-credit-note'}
      style={{ width: '450px' }}
    >
      <DialogSuspense>
        <RefundCreditNoteDialogContent
          dialogName={dialogName}
          creditNoteId={creditNoteId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(RefundCreditNoteDialog);
