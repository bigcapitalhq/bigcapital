// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const RefundCreditNoteDialogContent = React.lazy(() =>
  import('./RefundCreditNoteDialogContent'),
);

/**
 * Refund credit note dialog.
 */
function RefundCreditNoteDialog({
  dialogName,
  payload: { creditNoteId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'refund_credit_note.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--refund-credit-note'}
      style={{ width: '450px' }}
    >
      <DialogSuspense>
        <RefundCreditNoteDialogContent
          dialogName={dialogName}
          creditNoteId={creditNoteId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(RefundCreditNoteDialog);
