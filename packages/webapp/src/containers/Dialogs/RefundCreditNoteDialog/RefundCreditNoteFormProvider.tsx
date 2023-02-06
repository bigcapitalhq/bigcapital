// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { pick } from 'lodash';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useAccounts,
  useCreditNote,
  useBranches,
  useCreateRefundCreditNote,
} from '@/hooks/query';

const RefundCreditNoteContext = React.createContext();

/**
 * Refund credit note form provider.
 */
function RefundCreditNoteFormProvider({
  creditNoteId,
  dialogName,
  query,
  ...props
}) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch credit note data.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

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
    branches,
    dialogName,
    isBranchesSuccess,

    createRefundCreditNoteMutate,
  };

  return (
    <DialogContent
      isLoading={isAccountsLoading || isCreditNoteLoading || isBranchesLoading}
    >
      <RefundCreditNoteContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRefundCreditNoteContext = () =>
  React.useContext(RefundCreditNoteContext);

export { RefundCreditNoteFormProvider, useRefundCreditNoteContext };
