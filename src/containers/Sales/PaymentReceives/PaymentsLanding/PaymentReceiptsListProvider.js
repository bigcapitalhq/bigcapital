import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useResourceViews,
  useResourceMeta,
  usePaymentReceives,
} from 'hooks/query';
import { isTableEmptyStatus, getFieldsFromResourceMeta } from 'utils';

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
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('payment_receives');

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

    resourceMeta,
    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    paymentReceivesViews,

    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
    isResourceFetching,
    isResourceLoading,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'payment-receives-list'}
    >
      <PaymentReceivesListContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceivesListContext = () =>
  useContext(PaymentReceivesListContext);

export { PaymentReceivesListProvider, usePaymentReceivesListContext };
