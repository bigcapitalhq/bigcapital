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
  useGetSaleInvoiceState,
  GetSaleInvoiceStateResponse,
} from '@/hooks/query';
import { useProjects } from '@/containers/Projects/hooks';
import { useTaxRates } from '@/hooks/query/taxRates';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useGetPaymentServices } from '@/hooks/query/payment-services';

interface InvoiceFormContextValue {
  saleInvoiceState: GetSaleInvoiceStateResponse | null;
  isInvoiceStateLoading: boolean;
}

const InvoiceFormContext = createContext<InvoiceFormContextValue>(
  {} as InvoiceFormContextValue,
);

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

  // Fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Fetch tax rates.
  const { data: taxRates, isLoading: isTaxRatesLoading } = useTaxRates();

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

  // Fetches branding templates of invoice.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'SaleInvoice' });

  // Fetches the payment services.
  const { data: paymentServices, isLoading: isPaymentServicesLoading } =
    useGetPaymentServices();

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
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  const { data: saleInvoiceState, isLoading: isInvoiceStateLoading } =
    useGetSaleInvoiceState();

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
  const isFeatureLoading =
    isWarehouesLoading ||
    isBranchesLoading ||
    isProjectsLoading ||
    isBrandingTemplatesLoading;

  const isBootLoading =
    isInvoiceLoading ||
    isItemsLoading ||
    isCustomersLoading ||
    isEstimateLoading ||
    isSettingsLoading ||
    isInvoiceStateLoading;

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
    taxRates,
    brandingTemplates,

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,
    isSettingsLoading,
    isWarehouesLoading,
    isBranchesLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    isTaxRatesLoading,
    isBrandingTemplatesLoading,

    createInvoiceMutate,
    editInvoiceMutate,
    setSubmitPayload,
    isNewMode,

    // Payment Services
    paymentServices,
    isPaymentServicesLoading,

    // Invoice state
    saleInvoiceState,
    isInvoiceStateLoading,

    isBootLoading,
  };

  return <InvoiceFormContext.Provider value={provider} {...props} />;
}

const useInvoiceFormContext = () =>
  React.useContext<InvoiceFormContextValue>(InvoiceFormContext);

export { InvoiceFormProvider, useInvoiceFormContext };
