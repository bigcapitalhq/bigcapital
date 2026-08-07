import React, { createContext } from 'react';
import type { BadDebtContextValue } from './types';
import { DialogContent } from '@/components';
import { useAccounts, useInvoice, useCreateBadDebt } from '@/hooks/query';

const BadDebtContext = createContext<BadDebtContextValue>(
  {} as BadDebtContextValue,
);

interface BadDebtFormProviderProps {
  invoiceId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Bad debt provider.
 */
function BadDebtFormProvider({
  invoiceId,
  dialogName,
  ...props
}: BadDebtFormProviderProps) {
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Create and cancel bad debt mutations.
  const { mutateAsync: createBadDebtMutate } = useCreateBadDebt();

  // State provider.
  const provider: BadDebtContextValue = {
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
