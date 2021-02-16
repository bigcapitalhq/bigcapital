import React, { createContext, useContext } from 'react';
import {
  useAccounts,
  useVendors,
  useItems,
  usePaymentMade,
  useSettings,
  useCreatePaymentMade,
  useEditPaymentMade,
  useDueBills,
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
  } = useItems();

  // Handle fetch venders data table or list.
  const {
    data: { vendors },
    isFetching: isVendorsFetching,
  } = useVendors();

  // Handle fetch specific payment made details.
  const {
    data: { paymentMade, payableBills, paymentBills },
    isFetching: isPaymentFetching,
    isLoading: isPaymentLoading,
  } = usePaymentMade(paymentMadeId, {
    enabled: !!paymentMadeId,
  });

  // Retrieve the due bills of the given vendor.
  const {
    data: dueBills,
    isLoading: isDueBillsLoading,
    isFetching: isDueBillsFetching,
  } = useDueBills(paymentVendorId, { enabled: !!paymentVendorId });

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
    paymentMade,
    payableBills,
    paymentBills,
    vendors,
    items,
    dueBills,
    submitPayload,
    paymentVendorId,

    isNewMode,
    isAccountsFetching,
    isItemsFetching,
    isItemsLoading,
    isVendorsFetching,
    isPaymentFetching,
    isPaymentLoading,
    isDueBillsLoading,
    isDueBillsFetching,

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
