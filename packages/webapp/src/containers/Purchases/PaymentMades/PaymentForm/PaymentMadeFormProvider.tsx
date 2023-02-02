// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useAccounts,
  useVendors,
  useItems,
  useBranches,
  usePaymentMadeEditPage,
  useSettings,
  useCreatePaymentMade,
  useEditPaymentMade,
} from '@/hooks/query';
import { DashboardInsider } from '@/components';

// Payment made form context.
const PaymentMadeFormContext = createContext();

/**
 * Payment made form provider.
 */
function PaymentMadeFormProvider({ query, paymentMadeId, ...props }) {
  const [submitPayload, setSubmitPayload] = React.useState({});
  const [paymentVendorId, setPaymentVendorId] = React.useState(null);

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch Items data table or list.
  const {
    data: { items },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({ page_size: 10000 });

  // Handle fetch venders data table or list.
  const {
    data: { vendors },
    isLoading: isVendorsLoading,
  } = useVendors({ page_size: 10000 });

  // Handle fetch specific payment made details.
  const {
    data: { paymentMade: paymentMadeEditPage, entries: paymentEntriesEditPage },
    isFetching: isPaymentFetching,
    isLoading: isPaymentLoading,
  } = usePaymentMadeEditPage(paymentMadeId, {
    enabled: !!paymentMadeId,
  });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetch payment made settings.
  useSettings();

  // Create and edit payment made mutations.
  const { mutateAsync: createPaymentMadeMutate } = useCreatePaymentMade();
  const { mutateAsync: editPaymentMadeMutate } = useEditPaymentMade();

  const isNewMode = !paymentMadeId;

  const isFeatureLoading = isBranchesLoading;

  // Provider payload.
  const provider = {
    paymentMadeId,
    accounts,
    paymentEntriesEditPage,
    paymentMadeEditPage,
    vendors,
    items,
    branches,
    submitPayload,
    paymentVendorId,

    isNewMode,
    isAccountsLoading,
    isItemsFetching,
    isItemsLoading,
    isVendorsLoading,
    isPaymentFetching,
    isPaymentLoading,
    isFeatureLoading,
    isBranchesSuccess,

    createPaymentMadeMutate,
    editPaymentMadeMutate,

    setSubmitPayload,
    setPaymentVendorId,
  };

  return (
    <DashboardInsider
      loading={
        isVendorsLoading ||
        isItemsLoading ||
        isAccountsLoading ||
        isPaymentLoading
      }
      name={'payment-made'}
    >
      <PaymentMadeFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadeFormContext = () => useContext(PaymentMadeFormContext);

export { PaymentMadeFormProvider, usePaymentMadeFormContext };
