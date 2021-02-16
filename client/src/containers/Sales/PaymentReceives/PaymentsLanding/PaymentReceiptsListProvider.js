import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useResourceViews,
  useResourceFields,
  usePaymentReceives,
} from 'hooks/query';
import { isTableEmptyStatus } from 'utils';

const PaymentReceivesListContext = createContext();

/**
 * Payment receives list data provider.
 */
function PaymentReceivesListProvider({ query, ...props }) {
  // Fetch payment receives resource views and fields.
  const {
    data: paymentReceivesViews,
    isFetching: isViewsLoading,
  } = useResourceViews('payment_receives');

  // Fetch the payment receives resource fields.
  const {
    data: paymentReceivesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('payment_receives');

  // Fetch payment receives list according to the given custom view id.
  const {
    data: { paymentReceives, pagination, filterMeta },
    isLoading: isPaymentReceivesLoading,
    isFetching: isPaymentReceivesFetching,
  } = usePaymentReceives(query);

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: paymentReceives,
      pagination,
      filterMeta,
    }) && !isPaymentReceivesLoading;

  // Provider payload.
  const state = {
    paymentReceives,
    pagination,
    paymentReceivesFields,
    paymentReceivesViews,

    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
    isFieldsLoading,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'payment-receives'}
    >
      <PaymentReceivesListContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceivesListContext = () =>
  useContext(PaymentReceivesListContext);

export { PaymentReceivesListProvider, usePaymentReceivesListContext };
