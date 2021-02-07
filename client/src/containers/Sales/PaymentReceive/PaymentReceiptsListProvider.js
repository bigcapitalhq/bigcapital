import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, usePaymentReceives } from 'hooks/query';

const PaymentReceivesListContext = createContext();

/**
 * Payment receives list data provider.
 */
function PaymentReceivesListProvider({ query, ...props }) {
  // Fetch payment receives resource views and fields.
  const { data: paymentReceivesViews, isFetching: isViewsLoading } = useResourceViews(
    'payment_receives',
  );

  // Fetch the payment receives resource fields.
  const {
    data: paymentReceivesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('payment_receives');

  // Fetch payment receives list according to the given custom view id.
  const {
    data: { paymentReceives, pagination },
    isFetching: isPaymentReceivesLoading,
  } = usePaymentReceives(query);

  // Provider payload.
  const provider = {
    paymentReceives,
    pagination,
    paymentReceivesFields,
    paymentReceivesViews,

    isPaymentReceivesLoading,
    isFieldsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'payment-receives'}
    >
      <PaymentReceivesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceivesListContext = () => React.useContext(PaymentReceivesListContext);

export { PaymentReceivesListProvider, usePaymentReceivesListContext };
