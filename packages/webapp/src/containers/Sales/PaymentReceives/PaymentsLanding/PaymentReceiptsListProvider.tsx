// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  usePaymentReceives,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const PaymentReceivesListContext = createContext();

/**
 * Payment receives list data provider.
 */
function PaymentReceivesListProvider({ query, tableStateChanged, ...props }) {
  // Fetch payment receives resource views and fields.
  const { data: paymentReceivesViews, isLoading: isViewsLoading } =
    useResourceViews('payment_receives');

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

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(paymentReceives) && !isPaymentReceivesLoading && !tableStateChanged;

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
