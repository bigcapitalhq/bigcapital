import React, { createContext, useContext } from 'react';
import { isEqual, isUndefined } from 'lodash';
import {
  useAccounts,
  useVendors,
  useItems,
  useBranches,
  usePaymentMadeEditPage,
  useSettings,
  useCreatePaymentMade,
  useEditPaymentMade,
} from 'hooks/query';
import { DashboardInsider } from 'components';

// Payment made form context.
const PaymentMadeFormContext = createContext();

/**
 * Payment made form provider.
 */
function PaymentMadeFormProvider({ paymentMadeId, baseCurrency, ...props }) {
  const [submitPayload, setSubmitPayload] = React.useState({});
  const [paymentVendorId, setPaymentVendorId] = React.useState(null);
  const [selectVendor, setSelectVendor] = React.useState(null);

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
  } = useBranches();

  // Fetch payment made settings.
  useSettings();

  // Create and edit payment made mutations.
  const { mutateAsync: createPaymentMadeMutate } = useCreatePaymentMade();
  const { mutateAsync: editPaymentMadeMutate } = useEditPaymentMade();

  const isNewMode = !paymentMadeId;

  const isFeatureLoading = isBranchesLoading;

  // Determines whether the foreign vendor.
  const isForeignVendor =
    !isEqual(selectVendor?.currency_code, baseCurrency) &&
    !isUndefined(selectVendor?.currency_code);

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
    baseCurrency,
    selectVendor,
    setSelectVendor,
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
    isForeignVendor,

    createPaymentMadeMutate,
    editPaymentMadeMutate,

    setSubmitPayload,
    setPaymentVendorId,
  };

  return (
    <DashboardInsider
      loading={
        isVendorsLoading ||
        isItemsFetching ||
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
