// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import { useResourceViews, useResourceMeta, useInvoices } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const InvoicesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoicesListProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: invoicesViews, isLoading: isViewsLoading } =
    useResourceViews('sale_invoices');

  // Fetch resource fields of the sale invoices.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('sale_invoices');

  // Fetch sale invoices of the given query.
  const {
    data: { invoices, pagination, filterMeta },
    isFetching: isInvoicesFetching,
    isLoading: isInvoicesLoading,
  } = useInvoices(query, { keepPreviousData: true });

  // Determines whether the table should show empty state.
  const isEmptyStatus =
    isEmpty(invoices) && !tableStateChanged && !isInvoicesLoading;

  // Provider payload.
  const provider = {
    invoices,
    pagination,

    invoicesFields: getFieldsFromResourceMeta(resourceMeta.fields),
    invoicesViews,

    isInvoicesLoading,
    isInvoicesFetching,
    isResourceFetching,
    isResourceLoading,
    isViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'sales-invoices-list'}
    >
      <InvoicesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoicesListContext = () => React.useContext(InvoicesListContext);

export { InvoicesListProvider, useInvoicesListContext };
