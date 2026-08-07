import { pick } from 'lodash';
import React, { useMemo, createContext } from 'react';
import type { QuickPaymentMadeContextValue } from './types';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useBill,
  useAccounts,
  useBranches,
  useCreatePaymentMade,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const QuickPaymentMadeContext = createContext<QuickPaymentMadeContextValue>(
  {} as QuickPaymentMadeContextValue,
);

interface QuickPaymentMadeFormProviderProps {
  query?: Record<string, unknown>;
  billId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Quick payment made dialog provider.
 */
function QuickPaymentMadeFormProvider({
  query,
  billId,
  dialogName,
  ...props
}: QuickPaymentMadeFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Create payment made mutations.
  const { mutateAsync: createPaymentMadeMutate } = useCreatePaymentMade();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  const paymentBill = useMemo(
    () =>
      pick(bill, [
        'id',
        'dueAmount',
        'vendorId',
        'currencyCode',
      ]) as QuickPaymentMadeContextValue['bill'],
    [bill],
  );

  // State provider.
  const provider: QuickPaymentMadeContextValue = {
    bill: paymentBill,
    accounts,
    branches,
    dialogName,
    createPaymentMadeMutate,
    isBranchesSuccess,
  };

  return (
    <DialogContent
      isLoading={isAccountsLoading || isBillLoading || isBranchesLoading}
    >
      <QuickPaymentMadeContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useQuickPaymentMadeContext = () =>
  React.useContext(QuickPaymentMadeContext);

export { QuickPaymentMadeFormProvider, useQuickPaymentMadeContext };
