import { isEmpty, pick } from 'lodash';
import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { transformToEditForm, ITEMS_FILTER_ROLES_QUERY } from './utils';
import type {
  SaleInvoice,
  CreateSaleInvoiceBody,
  EditSaleInvoiceBody,
  SaleInvoiceStateResponse,
  Item,
  Customer,
  Warehouse,
  Branch,
  TaxRate,
  PdfTemplateResponse,
  GetPaymentServicesResponse,
} from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useInvoice,
  useItems,
  useCustomers,
  useWarehouses,
  useBranches,
  useCreateInvoice,
  useEditInvoice,
  useSettingsInvoices,
  useEstimateDetail as useEstimate,
  useGetSaleInvoiceState,
} from '@/hooks/query';
import { useGetPaymentServices } from '@/hooks/query/payment-services';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useTaxRates } from '@/hooks/query/tax-rates';
import { useFeatureCan } from '@/hooks/state';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

type InvoiceFormSubmitPayload = {
  redirect?: boolean;
  deliver?: boolean;
  resetForm?: boolean;
};

type InvoiceFormContextValue = {
  invoice: SaleInvoice | undefined;
  items: Item[];
  customers: Customer[];
  newInvoice: ReturnType<typeof transformToEditForm> | [];
  estimateId: string | undefined;
  invoiceId: number | undefined;
  submitPayload: InvoiceFormSubmitPayload | undefined;
  branches: Branch[];
  warehouses: Warehouse[];
  projects: unknown[];
  taxRates: TaxRate[];
  brandingTemplates: PdfTemplateResponse[];
  paymentServices: GetPaymentServicesResponse | undefined;

  isInvoiceLoading: boolean;
  isItemsLoading: boolean;
  isCustomersLoading: boolean;
  isSettingsLoading: boolean;
  invoiceSettings: SettingsGroup | undefined;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;
  isTaxRatesLoading: boolean;
  isBrandingTemplatesLoading: boolean;
  isInvoiceStateLoading: boolean;
  isPaymentServicesLoading: boolean;
  isBootLoading: boolean;
  isNewMode: boolean;

  createInvoiceMutate: (values: CreateSaleInvoiceBody) => Promise<void>;
  editInvoiceMutate: (args: [number, EditSaleInvoiceBody]) => Promise<void>;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<InvoiceFormSubmitPayload | undefined>
  >;

  saleInvoiceState: SaleInvoiceStateResponse | undefined;
};

const InvoiceFormContext = createContext<InvoiceFormContextValue | undefined>(
  undefined,
);

type InvoiceFormProviderProps = {
  invoiceId?: number;
  baseCurrency?: string;
  children?: React.ReactNode;
};

/**
 * Invoice form data provider.
 */
function InvoiceFormProvider({
  invoiceId,
  baseCurrency,
  ...props
}: InvoiceFormProviderProps) {
  const { state } = useLocation();
  const estimateId = (state as { action?: string })?.action;
  const estimateIdNum = estimateId ? Number(estimateId) : undefined;

  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId);

  // Fetch tax rates.
  const { data: taxRates, isLoading: isTaxRatesLoading } = useTaxRates();

  // Fetch project list.
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(
    {},
    { enabled: !!isProjectsFeatureCan },
  );

  // Fetches the estimate by the given id.
  const { data: estimate, isLoading: isEstimateLoading } = useEstimate(
    estimateIdNum,
    { enabled: !!estimateIdNum },
  );

  // Fetches branding templates of invoice.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'SaleInvoice' });

  // Fetches the payment services.
  const { data: paymentServices, isLoading: isPaymentServicesLoading } =
    useGetPaymentServices();

  const newInvoice = !isEmpty(estimate)
    ? transformToEditForm({
        ...pick(estimate, ['customerId', 'currencyCode', 'entries']),
      })
    : ([] as []);

  // Handle fetching the items table based on the given query.
  const { data: itemsData, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES_QUERY,
  });

  // Handle fetch customers data table or list
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page_size: 10000,
  });

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
  const { data: invoiceSettings, isLoading: isSettingsLoading } =
    useSettingsInvoices();

  // Create and edit invoice mutations.
  const { mutateAsync: createInvoiceMutate } = useCreateInvoice();
  const { mutateAsync: editInvoiceMutate } = useEditInvoice();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = useState<
    InvoiceFormSubmitPayload | undefined
  >();

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

  const provider: InvoiceFormContextValue = {
    invoice,
    items: itemsData?.data ?? [],
    customers: customersData?.data ?? [],
    newInvoice,
    estimateId,
    invoiceId,
    submitPayload,
    branches: branches ?? [],
    warehouses: warehouses ?? [],
    projects:
      (projectsData as { data?: { projects?: unknown[] } })?.data?.projects ??
      [],
    taxRates: taxRates ?? [],
    brandingTemplates: brandingTemplates?.templates ?? [],

    isInvoiceLoading,
    isItemsLoading,
    isCustomersLoading,
    isSettingsLoading,
    invoiceSettings,
    isWarehouesLoading,
    isBranchesLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    isTaxRatesLoading,
    isBrandingTemplatesLoading,

    createInvoiceMutate: createInvoiceMutate as (
      values: CreateSaleInvoiceBody,
    ) => Promise<void>,
    editInvoiceMutate: editInvoiceMutate as (
      args: [number, EditSaleInvoiceBody],
    ) => Promise<void>,
    setSubmitPayload,
    isNewMode,

    paymentServices,
    isPaymentServicesLoading,

    saleInvoiceState,
    isInvoiceStateLoading,

    isBootLoading,
  };

  return <InvoiceFormContext.Provider value={provider} {...props} />;
}

const useInvoiceFormContext = (): InvoiceFormContextValue => {
  const ctx = React.useContext(InvoiceFormContext);
  if (!ctx) {
    throw new Error(
      'useInvoiceFormContext must be used within an InvoiceFormProvider',
    );
  }
  return ctx;
};

export { InvoiceFormProvider, useInvoiceFormContext };
