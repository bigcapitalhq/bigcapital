import React from 'react';
import { DialogContent } from 'components';
import {
  useBill,
  useAccounts,
  useBranches,
  useCreatePaymentMade,
} from 'hooks/query';

import { pick } from 'lodash';

const QuickPaymentMadeContext = React.createContext();

/**
 * Quick payment made dialog provider.
 */
function QuickPaymentMadeFormProvider({ billId, dialogName, ...props }) {
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
  } = useBranches();

  // State provider.
  const provider = {
    bill: {
      ...pick(bill, ['id', 'due_amount', 'vendor', 'currency_code']),
      vendor_id: bill?.vendor?.display_name,
      payment_amount: bill?.due_amount,
    },
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
