// @ts-nocheck
import { pick } from 'lodash';
import React, { useContext, createContext, useMemo } from 'react';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useInvoice,
  useBranches,
  useSettingsPaymentReceives,
  useCreatePaymentReceive,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

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
  const {
    isLoading: isSettingsLoading,
    data: paymentReceiveSettings,
  } = useSettingsPaymentReceives();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  const invoicePayment = useMemo(
    () => pick(invoice, ['id', 'due_amount', 'customer_id', 'currency_code']),
    [invoice],
  );

  // State provider.
  const provider = {
    accounts,
    branches,
    invoice: invoicePayment,
    isAccountsLoading,
    isSettingsLoading,
    isBranchesSuccess,
    dialogName,
    baseCurrency,
    paymentReceiveSettings: paymentReceiveSettings as SettingsGroup | undefined,
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
