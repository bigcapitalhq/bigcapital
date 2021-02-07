import React, { createContext, useState } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useInvoice,
  useItems,
  useCustomers,
  useCreateInvoice,
  useEditInvoice,
} from 'hooks/query';

const InvoiceFormContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoiceFormProvider({ invoiceId, ...props }) {
  const { data: invoice, isFetching: isInvoiceLoading } = useInvoice(
    invoiceId,
    {
      enabled: !!invoiceId,
    },
  );

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isFetching: isItemsLoading,
  } = useItems();

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isFetching: isCustomersLoading,
  } = useCustomers();

  // Create and edit invoice mutations.
  const { mutateAsync: createInvoiceMutate } = useCreateInvoice();
  const { mutateAsync: editInvoiceMutate } = useEditInvoice();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState({});

  // Provider payload.
  const provider = {
    invoice,
    items,
    customers,
    submitPayload,

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,

    createInvoiceMutate,
    editInvoiceMutate,
    setSubmitPayload,
  };

  return (
    <DashboardInsider
      loading={isInvoiceLoading || isItemsLoading || isCustomersLoading}
      name={'invoice-form'}
    >
      <InvoiceFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoiceFormContext = () => React.useContext(InvoiceFormContext);

export { InvoiceFormProvider, useInvoiceFormContext };
