// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceFields,
  usePaymentMades,
} from '@/hooks/query';

const PaymentMadesContext = createContext();

/**
 * Accounts chart data provider.
 */
function PaymentMadesProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: paymentsViews, isLoading: isViewsLoading } =
    useResourceViews('bill_payments');

  // Fetch the accounts resource fields.
  const { data: paymentsFields, isLoading: isFieldsLoading } =
    useResourceFields('bill_payments');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentMades, pagination },
    isLoading: isPaymentsLoading,
  } = usePaymentMades(query);

  // Provider payload.
  const provider = {
    paymentMades,
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
      <PaymentMadesContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadesContext = () => React.useContext(PaymentMadesContext);

export { PaymentMadesProvider, usePaymentMadesContext };
