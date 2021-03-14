import React from 'react';
import { DialogContent } from 'components';
import { useBill, useAccounts, useCreatePaymentMade } from 'hooks/query';

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

  // State provider.
  const provider = {
    bill: {
      ...pick(bill, ['id', 'due_amount', 'vendor', 'currency_code']),
      vendor_id: bill?.vendor?.display_name,
      payment_amount: bill?.due_amount,
    },
    accounts,
    dialogName,
    createPaymentMadeMutate,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isBillLoading}>
      <QuickPaymentMadeContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useQuickPaymentMadeContext = () =>
  React.useContext(QuickPaymentMadeContext);

export { QuickPaymentMadeFormProvider, useQuickPaymentMadeContext };
