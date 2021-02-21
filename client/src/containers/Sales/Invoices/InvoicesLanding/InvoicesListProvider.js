import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useInvoices } from 'hooks/query';
import { isTableEmptyStatus } from 'utils';

const InvoicesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoicesListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: invoicesViews, isFetching: isViewsLoading } = useResourceViews(
    'sale_invoices',
  );

  // Fetch the accounts resource fields.
  const {
    data: invoicesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('sale_invoices');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { invoices, pagination, filterMeta },
    isFetching: isInvoicesFetching,
    isLoading: isInvoicesLoading,
  } = useInvoices(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: invoices,
      pagination,
      filterMeta,
    }) && !isInvoicesLoading;

  // Provider payload.
  const provider = {
    invoices,
    pagination,
    invoicesFields,
    invoicesViews,

    isInvoicesLoading,
    isInvoicesFetching,
    isFieldsLoading,
    isViewsLoading,

    isEmptyStatus
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'sales-invoices-list'}
    >
      <InvoicesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoicesListContext = () => React.useContext(InvoicesListContext);

export { InvoicesListProvider, useInvoicesListContext };
