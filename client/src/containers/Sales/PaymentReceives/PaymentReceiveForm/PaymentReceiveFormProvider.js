import React, { createContext, useContext } from 'react';
import { DashboardInsider } from 'components';
import {
  useSettings,
  usePaymentReceive,
  useAccounts,
  useCustomers,
  useCreatePaymentReceive,
  useEditPaymentReceive
} from 'hooks/query';

// Payment receive form context.
const PaymentReceiveFormContext = createContext();

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({ paymentReceiveId, ...props }) {
  // Fetches payment recevie details.
  const {
    data: paymentReceive,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceive(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });

  // Handle fetch accounts data.
  const { data: accounts, isFetching: isAccountsFetching } = useAccounts();

  // Fetch payment made settings.
  const fetchSettings = useSettings();

  // Fetches customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
  } = useCustomers();

  const [submitPayload, setSubmitPayload] = React.useState({});
  const isNewMode = !paymentReceiveId;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // Provider payload.
  const provider = {
    paymentReceive,
    accounts,
    customers,

    isPaymentLoading,
    isPaymentFetching,
    isAccountsFetching,
    isCustomersFetching,

    submitPayload,
    setSubmitPayload,
    isNewMode,

    editPaymentReceiveMutate,
    createPaymentReceiveMutate
  };

  return (
    <DashboardInsider
      loading={
        isPaymentLoading ||
        isAccountsFetching ||
        isCustomersFetching
      }
      name={'payment-receive-form'}
    >
      <PaymentReceiveFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceiveFormContext = () =>
  useContext(PaymentReceiveFormContext);

export { PaymentReceiveFormProvider, usePaymentReceiveFormContext };
