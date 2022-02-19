import React, { createContext, useState } from 'react';
import { isEmpty, pick } from 'lodash';
import { useLocation } from 'react-router-dom';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm, ITEMS_FILTER_ROLES_QUERY } from './utils';
import {
  useInvoice,
  useItems,
  useCustomers,
  useWarehouses,
  useBranches,
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
  const { data: estimate, isLoading: isEstimateLoading } = useEstimate(
    estimateId,
    { enabled: !!estimateId },
  );

  const newInvoice = !isEmpty(estimate)
    ? transformToEditForm({
        ...pick(estimate, ['customer_id', 'customer', 'entries']),
      })
    : [];

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES_QUERY,
  });

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Fetch warehouses list.
  const {
    data: warehouses,
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingsInvoices();

  // Create and edit invoice mutations.
  const { mutateAsync: createInvoiceMutate } = useCreateInvoice();
  const { mutateAsync: editInvoiceMutate } = useEditInvoice();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState();

  // Detarmines whether the form in new mode.
  const isNewMode = !invoiceId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  // Determines whether the foreign customer.
  const isForeignCustomer = false;

  // Provider payload.
  const provider = {
    invoice,
    items,
    customers,
    newInvoice,
    estimateId,
    invoiceId,
    submitPayload,
    branches,
    warehouses,

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,
    isSettingsLoading,
    isWarehouesLoading,
    isBranchesLoading,
    isFeatureLoading,
    isForeignCustomer,
    isBranchesSuccess,
    isWarehousesSuccess,

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
