// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  usePaymentsMade,
  useResourceMeta,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const PaymentsMadeListContext = createContext();

/**
 * Accounts chart data provider.
 */
function PaymentsMadeListProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: paymentsMadeViews, isLoading: isViewsLoading } =
    useResourceViews('bill_payments');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('bill_payments');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentsMade, pagination, filterMeta },
    isLoading: isPaymentsLoading,
    isFetching: isPaymentsFetching,
  } = usePaymentsMade(query, { keepPreviousData: true });

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(paymentsMade) && !isPaymentsLoading && !tableStateChanged;

  // Provider payload.
  const provider = {
    paymentsMade,
    pagination,
    filterMeta,
    paymentsMadeViews,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    resourceMeta,
    isResourceMetaLoading,
    isResourceMetaFetching,

    isPaymentsLoading,
    isPaymentsFetching,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'payments-made-list'}
    >
      <PaymentsMadeListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentsMadeListContext = () =>
  React.useContext(PaymentsMadeListContext);

export { PaymentsMadeListProvider, usePaymentsMadeListContext };
