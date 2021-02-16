import React, { createContext, useContext } from 'react';
import { DashboardInsider } from 'components';
import {
  useSettings,
  usePaymentReceive,
  useAccounts,
  useCustomers,
  useCreatePaymentReceive,
  useEditPaymentReceive,
  useDueInvoices,
} from 'hooks/query';

// Payment receive form context.
const PaymentReceiveFormContext = createContext();

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({ paymentReceiveId, ...props }) {
  // Form state.
  const [paymentCustomerId, setPaymentCustomerId] = React.useState(null);
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Fetches payment recevie details.
  const {
    data: paymentReceive,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceive(paymentReceiveId, { enabled: !!paymentReceiveId });

  // Handle fetch accounts data.
  const { data: accounts, isFetching: isAccountsFetching } = useAccounts();

  // Fetch payment made settings.
  const fetchSettings = useSettings();

  // Fetches customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
  } = useCustomers();

  // Fetches customer receivable invoices.
  const {
    data: dueInvoices,
    isLoading: isDueInvoicesLoading,
    isFetching: isDueInvoicesFetching,
  } = useDueInvoices(paymentCustomerId, {
    enabled: !!paymentCustomerId,
  });

  // Detarmines whether the new mode.
  const isNewMode = !paymentReceiveId;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // Provider payload.
  const provider = {
    paymentReceive,
    accounts,
    customers,
    dueInvoices,

    isPaymentLoading,
    isPaymentFetching,
    isAccountsFetching,
    isCustomersFetching,
    isDueInvoicesLoading,
    isDueInvoicesFetching,

    paymentCustomerId,
    submitPayload,
    isNewMode,
    
    setSubmitPayload,
    setPaymentCustomerId,

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
