import React, { useContext, createContext } from 'react';
import { pick } from 'lodash';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useAccounts,
  useInvoice,
  useBranches,
  useSettingsPaymentReceives,
  useCreatePaymentReceive,
} from '@/hooks/query';

const QuickPaymentReceiveContext = createContext();

/**
 * Quick payment receive dialog provider.
 */
function QuickPaymentReceiveFormProvider({
  query,
  invoiceId,
  dialogName,
  baseCurrency,
  ...props
}) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });
  // Create and edit payment receive mutations.
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // Fetch payment made settings.
  const { isLoading: isSettingsLoading } = useSettingsPaymentReceives();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // State provider.
  const provider = {
    accounts,
    branches,
    invoice: {
      ...pick(invoice, ['id', 'due_amount', 'customer', 'currency_code']),
      customer_id: invoice?.customer?.display_name,
      payment_amount: invoice.due_amount,
    },
    isAccountsLoading,
    isSettingsLoading,
    isBranchesSuccess,
    dialogName,
    baseCurrency,
    createPaymentReceiveMutate,
  };

  return (
    <DialogContent
      isLoading={isAccountsLoading || isInvoiceLoading || isBranchesLoading}
    >
      <QuickPaymentReceiveContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useQuickPaymentReceiveContext = () =>
  useContext(QuickPaymentReceiveContext);

export { QuickPaymentReceiveFormProvider, useQuickPaymentReceiveContext };
