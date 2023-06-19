// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceFields,
  usePaymentsMade,
} from '@/hooks/query';

const PaymentsMadeContext = createContext();

/**
 * Accounts chart data provider.
 */
function PaymentsMadeProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: paymentsViews, isLoading: isViewsLoading } =
    useResourceViews('bill_payments');

  // Fetch the accounts resource fields.
  const { data: paymentsFields, isLoading: isFieldsLoading } =
    useResourceFields('bill_payments');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentsMade, pagination },
    isLoading: isPaymentsLoading,
  } = usePaymentsMade(query);

  // Provider payload.
  const provider = {
    paymentsMade,
    pagination,
    paymentsFields,
    paymentsViews,

    isPaymentsLoading,
    isFieldsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'payment_made'}
    >
      <PaymentsMadeContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentsMadeContext = () => React.useContext(PaymentsMadeContext);

export { PaymentsMadeProvider, usePaymentsMadeContext };
