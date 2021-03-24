import React, { createContext, useState } from 'react';
import { isEmpty, pick } from 'lodash';
import { useLocation } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm } from './utils';
import {
  useInvoice,
  useItems,
  useCustomers,
  useCreateInvoice,
  useEditInvoice,
  useSettingsInvoices,
  useEstimate,
} from 'hooks/query';

const InvoiceFormContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoiceFormProvider({ invoiceId, ...props }) {
  const { state } = useLocation();
  const estimateId = state?.action;

  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Fetches the estimate by the given id.
  const {
    data: estimate,
    isLoading: isEstimateLoading,
  } = useEstimate(estimateId, { enabled: !!estimateId });

  const newInvoice = !isEmpty(estimate)
    ? transformToEditForm({
        ...pick(estimate, ['customer_id', 'customer', 'entries']),
      })
    : [];

  // Filter all sellable items only.
  const stringifiedFilterRoles = React.useMemo(
    () =>
      JSON.stringify([
        { index: 1, fieldKey: 'sellable', value: true, condition: '&&', comparator: 'equals', },
        { index: 2, fieldKey: 'active', value: true, condition: '&&', comparator: 'equals' },
      ]),
    [],
  );

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingsInvoices();

  // Create and edit invoice mutations.
  const { mutateAsync: createInvoiceMutate } = useCreateInvoice();
  const { mutateAsync: editInvoiceMutate } = useEditInvoice();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState();

  // Detarmines whether the form in new mode.
  const isNewMode = !invoiceId;

  // Provider payload.
  const provider = {
    invoice,
    items,
    customers,
    newInvoice,
    estimateId,
    submitPayload,

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,
    isSettingsLoading,

    createInvoiceMutate,
    editInvoiceMutate,
    setSubmitPayload,
    isNewMode,
  };

  return (
    <DashboardInsider
      loading={
        isInvoiceLoading ||
        isItemsLoading ||
        isCustomersLoading ||
        isEstimateLoading ||
        isSettingsLoading
      }
      name={'invoice-form'}
    >
      <InvoiceFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoiceFormContext = () => React.useContext(InvoiceFormContext);

export { InvoiceFormProvider, useInvoiceFormContext };
