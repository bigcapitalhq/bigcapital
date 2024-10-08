// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  usePaymentReceives,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const PaymentsReceivedListContext = createContext();

/**
 * Payment receives data provider.
 */
function PaymentsReceivedListProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: paymentReceivesViews, isFetching: isViewsLoading } =
    useResourceViews('payment_receives');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isFetching: isResourceFetching,
    isLoading: isResourceLoading,
  } = useResourceMeta('payment_receives');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentReceives, pagination, filterMeta },
    isLoading: isPaymentReceivesLoading,
    isFetching: isPaymentReceivesFetching,
  } = usePaymentReceives(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    !isPaymentReceivesLoading && !tableStateChanged && isEmpty(paymentReceives);

  // Provider payload.
  const provider = {
    paymentReceives,
    paymentReceivesViews,
    pagination,
    resourceMeta,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    isEmptyStatus,
    isViewsLoading,
    isResourceFetching,
    isResourceLoading,
    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'payment_receives'}
    >
      <PaymentsReceivedListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentsReceivedListContext = () =>
  React.useContext(PaymentsReceivedListContext);

export { PaymentsReceivedListProvider, usePaymentsReceivedListContext };
