import React, { createContext, useContext } from 'react';
import {
  useAccounts,
  useVendors,
  useItems,
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
function PaymentMadeFormProvider({ paymentMadeId, ...props }) {
  const [submitPayload, setSubmitPayload] = React.useState({});
  const [paymentVendorId, setPaymentVendorId] = React.useState(null);

  // Handle fetch accounts data.
  const { data: accounts, isFetching: isAccountsFetching } = useAccounts();

  // Handle fetch Items data table or list.
  const {
    data: { items },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({ page_size: 10000 });

  // Handle fetch venders data table or list.
  const {
    data: { vendors },
    isFetching: isVendorsFetching,
  } = useVendors({ page_size: 10000 });

  // Handle fetch specific payment made details.
  const {
    data: { paymentMade: paymentMadeEditPage, entries: paymentEntriesEditPage },
    isFetching: isPaymentFetching,
    isLoading: isPaymentLoading,
  } = usePaymentMadeEditPage(paymentMadeId, {
    enabled: !!paymentMadeId,
  });

  // Fetch payment made settings.
  useSettings();

  // Create and edit payment made mutations.
  const { mutateAsync: createPaymentMadeMutate } = useCreatePaymentMade();
  const { mutateAsync: editPaymentMadeMutate } = useEditPaymentMade();

  const isNewMode = !paymentMadeId;

  // Provider payload.
  const provider = {
    paymentMadeId,
    accounts,
    paymentEntriesEditPage,
    paymentMadeEditPage,
    vendors,
    items,
    submitPayload,
    paymentVendorId,

    isNewMode,
    isAccountsFetching,
    isItemsFetching,
    isItemsLoading,
    isVendorsFetching,
    isPaymentFetching,
    isPaymentLoading,

    createPaymentMadeMutate,
    editPaymentMadeMutate,

    setSubmitPayload,
    setPaymentVendorId,
  };

  return (
    <DashboardInsider
      loading={
        isVendorsFetching ||
        isItemsFetching ||
        isAccountsFetching ||
        isPaymentFetching ||
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
