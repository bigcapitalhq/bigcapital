import React, { createContext, useContext } from 'react';
import { DashboardInsider } from 'components';
import {
  useSettings,
  usePaymentReceiveEditPage,
  useAccounts,
  useCustomers,
  useCreatePaymentReceive,
  useEditPaymentReceive,
} from 'hooks/query';

// Payment receive form context.
const PaymentReceiveFormContext = createContext();

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({ paymentReceiveId, ...props }) {
  // Form state.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Fetches payment recevie details.
  const {
    data: {
      paymentReceive: paymentReceiveEditPage,
      entries: paymentEntriesEditPage,
    },
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceiveEditPage(paymentReceiveId, {
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
  } = useCustomers({ page_size: 10000 });

  // Detarmines whether the new mode.
  const isNewMode = !paymentReceiveId;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // Provider payload.
  const provider = {
    paymentReceiveId,
    paymentReceiveEditPage,
    paymentEntriesEditPage,
    accounts,
    customers,

    isPaymentLoading,
    isPaymentFetching,
    isAccountsFetching,
    isCustomersFetching,
    isNewMode,

    submitPayload,
    setSubmitPayload,

    editPaymentReceiveMutate,
    createPaymentReceiveMutate,
  };

  return (
    <DashboardInsider
      loading={isPaymentLoading || isAccountsFetching || isCustomersFetching}
      name={'payment-receive-form'}
    >
      <PaymentReceiveFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceiveFormContext = () =>
  useContext(PaymentReceiveFormContext);

export { PaymentReceiveFormProvider, usePaymentReceiveFormContext };
