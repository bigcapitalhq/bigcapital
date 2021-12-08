import React from 'react';
import { DialogContent } from 'components';
import { pick } from 'lodash';

import {
  useAccounts,
  useCreditNote,
  useCreateRefundCreditNote,
} from 'hooks/query';

const RefundCreditNoteContext = React.createContext();

/**
 * Refund credit note form provider.
 */
function RefundCreditNoteFormProvider({ creditNoteId, dialogName, ...props }) {
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch credit note data.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );
  // Create and edit credit note mutations.
  const { mutateAsync: createRefundCreditNoteMutate } =
    useCreateRefundCreditNote();

  // State provider.
  const provider = {
    creditNote: {
      ...pick(creditNote, ['id', 'credits_remaining', 'currency_code']),
      amount: creditNote.credits_remaining,
    },
    accounts,
    dialogName,
    createRefundCreditNoteMutate,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isCreditNoteLoading}>
      <RefundCreditNoteContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRefundCreditNoteContext = () =>
  React.useContext(RefundCreditNoteContext);

export { RefundCreditNoteFormProvider, useRefundCreditNoteContext };
