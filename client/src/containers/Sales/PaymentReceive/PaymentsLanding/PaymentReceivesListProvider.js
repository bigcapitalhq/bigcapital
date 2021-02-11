import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useResourceViews,
  useResourceFields,
  usePaymentReceives,
} from 'hooks/query';

const PaymentReceivesListContext = createContext();

/**
 * Payment receives data provider.
 */
function PaymentReceivesListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const {
    data: paymentReceivesViews,
    isFetching: isViewsLoading,
  } = useResourceViews('payment_receives');

  // Fetch the accounts resource fields.
  const {
    data: paymentReceivesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('payment_receives');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentReceives, pagination, filterMeta },
    isLoading: isPaymentReceivesLoading,
    isFetching: isPaymentReceivesFetching,
  } = usePaymentReceives(query);

  // Provider payload.
  const provider = {
    paymentReceives,
    paymentReceivesViews,
    paymentReceivesFields,
    pagination,

    isViewsLoading,
    isFieldsLoading,
    isPaymentReceivesLoading,
    isPaymentReceivesFetching
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'payment_receives'}
    >
      <PaymentReceivesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceivesListContext = () =>
  React.useContext(PaymentReceivesListContext);

export { PaymentReceivesListProvider, usePaymentReceivesListContext };
