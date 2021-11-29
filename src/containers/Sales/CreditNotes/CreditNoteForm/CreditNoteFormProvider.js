import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm } from './utils';

import { useInvoice, useItems, useCustomers } from 'hooks/query';

const CreditNoteFormContext = React.createContext();

/**
 * Credit note data provider.
 */
function CreditNoteFormProvider({ creditNoteId, ...props }) {
  const { state } = useLocation();
  const invoiceId = state?.action;

  // Fetches the invoice by the given id.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
  });

  // const newCreditNote =

  // Create and edit credit note mutations.

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  // Provider payload.
  const provider = {
    invoice,
    items,
    customers,
    invoiceId,
    submitPayload,

    isItemsLoading,
    isCustomersLoading,

    setSubmitPayload,
    isNewMode,
  };

  return (
    <DashboardInsider
      loading={isInvoiceLoading || isItemsLoading || isCustomersLoading}
      name={'credit-note-form'}
    >
      <CreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteFormContext = () => React.useContext(CreditNoteFormContext);

export { CreditNoteFormProvider, useCreditNoteFormContext };
