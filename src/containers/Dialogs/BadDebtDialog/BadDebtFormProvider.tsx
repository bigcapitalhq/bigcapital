// @ts-nocheck
import React from 'react';

import { DialogContent } from '@/components';
import { useAccounts, useInvoice, useCreateBadDebt } from '@/hooks/query';

const BadDebtContext = React.createContext();

/**
 * Bad debt provider.
 */
function BadDebtFormProvider({ invoiceId, dialogName, ...props }) {
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Create and cancel bad debt mutations.
  const { mutateAsync: createBadDebtMutate } = useCreateBadDebt();

  // State provider.
  const provider = {
    accounts,
    invoice,
    invoiceId,
    dialogName,
    createBadDebtMutate,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isInvoiceLoading}>
      <BadDebtContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useBadDebtContext = () => React.useContext(BadDebtContext);

export { BadDebtFormProvider, useBadDebtContext };
