import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useInvoices } from 'hooks/query';

const InvoicesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoicesListProvider({ accountsTableQuery, ...props }) {
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
    data: { invoices, pagination },
    isFetching: isInvoicesLoading,
  } = useInvoices(accountsTableQuery);

  // Provider payload.
  const provider = {
    invoices,
    pagination,
    invoicesFields,
    invoicesViews,

    isInvoicesLoading,
    isFieldsLoading,
    isViewsLoading,
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
