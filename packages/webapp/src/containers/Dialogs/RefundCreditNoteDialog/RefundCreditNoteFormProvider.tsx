import { pick } from 'lodash';
import React, { createContext } from 'react';
import type { RefundCreditNoteContextValue } from './types';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useBranches,
  useCreateRefundCreditNote,
  useCreditNote,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const RefundCreditNoteContext = createContext<RefundCreditNoteContextValue>(
  {} as RefundCreditNoteContextValue,
);

interface RefundCreditNoteFormProviderProps {
  creditNoteId?: number | null;
  dialogName: string;
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * Refund credit note form provider.
 */
function RefundCreditNoteFormProvider({
  creditNoteId,
  dialogName,
  query,
  ...props
}: RefundCreditNoteFormProviderProps) {
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
  // FIXME: latent bug — `creditNote` may be undefined before the query resolves;
  // original code accessed `creditNote.creditsRemaining` directly. The pick
  // returns `{}` for undefined input so `amount` becomes undefined.
  const creditNoteRaw = creditNote as
    | (Record<string, unknown> & { creditsRemaining?: number })
    | undefined;
  const picked = pick(creditNoteRaw, [
    'id',
    'creditsRemaining',
    'currencyCode',
  ]) as { id?: number; creditsRemaining?: number; currencyCode?: string };

  const provider: RefundCreditNoteContextValue = {
    creditNote: creditNoteRaw
      ? {
          id: picked.id as number,
          creditsRemaining: (picked.creditsRemaining as number) ?? 0,
          currencyCode: (picked.currencyCode as string) ?? '',
          amount: (picked.creditsRemaining as number) ?? 0,
        }
      : undefined,
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
