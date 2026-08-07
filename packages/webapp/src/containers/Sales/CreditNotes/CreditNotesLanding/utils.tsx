import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

interface DeleteError {
  type: string;
}

export const handleDeleteErrors = (errors: DeleteError[]) => {
  if (
    errors.find((error) => error.type === 'CREDIT_NOTE_HAS_APPLIED_INVOICES')
  ) {
    AppToaster.show({
      message: intl.get(
        'credit_note.error.you_couldn_t_delete_credit_note_that_has_associated_invoice',
      ),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS',
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'credit_note.error.you_couldn_t_delete_credit_note_that_has_associated_refund',
      ),
      intent: Intent.DANGER,
    });
  }
};
