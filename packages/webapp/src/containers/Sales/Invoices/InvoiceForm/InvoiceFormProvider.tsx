// @ts-nocheck
import React, { createContext, useState } from 'react';
import { isEmpty, pick } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { DashboardInsider } from '@/components/Dashboard';
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
} from '@/hooks/query';
import { useProjects } from '@/containers/Projects/hooks';

const InvoiceFormContext = createContext();

/**
 * Accounts chart data provider.
 */
function InvoiceFormProvider({ invoiceId, baseCurrency, ...props }) {
  const { state } = useLocation();
  const estimateId = state?.action;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Fetch project list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectsFeatureCan });

  // Fetches the estimate by the given id.
  const { data: estimate, isLoading: isEstimateLoading } = useEstimate(
    estimateId,
    { enabled: !!estimateId },
  );

  const newInvoice = !isEmpty(estimate)
    ? transformToEditForm({
        ...pick(estimate, ['customer_id', 'currency_code', 'entries']),
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
    isLoading: isWarehousesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingsInvoices();

  // Create and edit invoice mutations.
  const { mutateAsync: createInvoiceMutate } = useCreateInvoice();
  const { mutateAsync: editInvoiceMutate } = useEditInvoice();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState();

  // Determines whether the form in new mode.
  const isNewMode = !invoiceId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading =
    isWarehousesLoading || isBranchesLoading || isProjectsLoading;

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
    projects,

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,
    isSettingsLoading,
    isWarehousesLoading,
    isBranchesLoading,
    isFeatureLoading,
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
