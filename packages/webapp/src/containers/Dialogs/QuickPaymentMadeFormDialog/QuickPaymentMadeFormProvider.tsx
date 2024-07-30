// @ts-nocheck
import React, { useMemo } from 'react';
import { DialogContent } from '@/components';
import {
  useBill,
  useAccounts,
  useBranches,
  useCreatePaymentMade,
} from '@/hooks/query';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { pick } from 'lodash';

const QuickPaymentMadeContext = React.createContext();

/**
 * Quick payment made dialog provider.
 */
function QuickPaymentMadeFormProvider({ query, billId, dialogName, ...props }) {
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
    () => pick(bill, ['id', 'due_amount', 'vendor_id', 'currency_code']),
    [bill],
  );

  // State provider.
  const provider = {
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
