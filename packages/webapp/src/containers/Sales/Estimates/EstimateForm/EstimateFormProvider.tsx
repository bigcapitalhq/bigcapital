import React, { createContext, useContext } from 'react';
import { ITEMS_FILTER_ROLES } from './utils';
import type { PdfTemplateResponse } from '@bigcapital/sdk-ts';
import type { Item, Customer } from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { useProjects } from '@/containers/Projects/hooks';
import {
  useEstimate,
  useCustomers,
  useWarehouses,
  useBranches,
  useItems,
  useSettingsEstimates,
  useCreateEstimate,
  useEditEstimate,
  useGetSaleEstimatesState,
} from '@/hooks/query';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { useFeatureCan } from '@/hooks/state';

type UseEstimateResult = ReturnType<typeof useEstimate>;
type UseBranchesResult = ReturnType<typeof useBranches>;
type UseWarehousesResult = ReturnType<typeof useWarehouses>;
type UseGetPdfTemplatesResult = ReturnType<typeof useGetPdfTemplates>;
type UseCreateEstimateResult = ReturnType<typeof useCreateEstimate>;
type UseEditEstimateResult = ReturnType<typeof useEditEstimate>;
type UseGetSaleEstimatesStateResult = ReturnType<
  typeof useGetSaleEstimatesState
>;

type EstimateFormSubmitPayload = {
  redirect?: boolean;
  deliver?: boolean;
  resetForm?: boolean;
};

interface EstimateFormContextValue {
  estimateId?: number;
  estimate: UseEstimateResult['data'];
  items: Item[];
  customers: Customer[];
  branches: UseBranchesResult['data'];
  warehouses: UseWarehousesResult['data'];
  projects: unknown[];
  isNewMode: boolean;

  isItemsFetching: boolean;
  isEstimateFetching: boolean;

  isCustomersLoading: boolean;
  isItemsLoading: boolean;
  isEstimateLoading: boolean;
  isFeatureLoading: boolean;
  isBranchesLoading: boolean;
  isWarehouesLoading: boolean;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;

  submitPayload: EstimateFormSubmitPayload;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<EstimateFormSubmitPayload>
  >;

  createEstimateMutate: UseCreateEstimateResult['mutateAsync'];
  editEstimateMutate: UseEditEstimateResult['mutateAsync'];

  brandingTemplates: PdfTemplateResponse[];
  isBrandingTemplatesLoading: boolean;

  saleEstimateState: UseGetSaleEstimatesStateResult['data'];
  isSaleEstimateStateLoading: boolean;

  estimatesSettings: import('@bigcapital/sdk-ts').SettingsGroup | undefined;

  isBootLoading: boolean;
}

type EstimateFormProviderProps = {
  query?: Record<string, unknown>;
  estimateId?: number;
  children?: React.ReactNode;
};

const EstimateFormContext = createContext<EstimateFormContextValue | undefined>(
  undefined,
);

/**
 * Estimate form provider.
 */
function EstimateFormProvider({
  query,
  estimateId,
  ...props
}: EstimateFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  const {
    data: estimate,
    isFetching: isEstimateFetching,
    isLoading: isEstimateLoading,
  } = useEstimate(estimateId, { enabled: !!estimateId });

  // Handle fetch Items data table or list
  const {
    data: itemsData,
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES,
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
  } = useWarehouses(query, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetches the projects list.
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(
    {},
    { enabled: !!isProjectsFeatureCan },
  );

  // Fetches branding templates of invoice.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'SaleEstimate' });

  // Fetches the sale estimate state.
  const { data: saleEstimateState, isLoading: isSaleEstimateStateLoading } =
    useGetSaleEstimatesState();

  // Handle fetch settings.
  const { data: estimatesSettings } = useSettingsEstimates();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] =
    React.useState<EstimateFormSubmitPayload>({});

  // Create and edit estimate form.
  const { mutateAsync: createEstimateMutate } = useCreateEstimate();
  const { mutateAsync: editEstimateMutate } = useEditEstimate();

  const isNewMode = !estimateId;

  const isFeatureLoading =
    isWarehouesLoading || isBranchesLoading || isProjectsLoading;

  const isBootLoading =
    isCustomersLoading ||
    isItemsLoading ||
    isEstimateLoading ||
    isBrandingTemplatesLoading ||
    isSaleEstimateStateLoading;

  const provider: EstimateFormContextValue = {
    estimateId,
    estimate,
    items: itemsData?.data ?? [],
    customers: customersData?.data ?? [],
    branches,
    warehouses,
    projects: projectsData?.data?.projects ?? [],
    isNewMode,

    isItemsFetching,
    isEstimateFetching,

    isCustomersLoading,
    isItemsLoading,
    isEstimateLoading,
    isFeatureLoading,
    isBranchesLoading,
    isWarehouesLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    submitPayload,
    setSubmitPayload,

    createEstimateMutate,
    editEstimateMutate,

    brandingTemplates: brandingTemplates?.templates ?? [],
    isBrandingTemplatesLoading,

    saleEstimateState,
    isSaleEstimateStateLoading,

    estimatesSettings,

    isBootLoading,
  };

  return <EstimateFormContext.Provider value={provider} {...props} />;
}

const useEstimateFormContext = (): EstimateFormContextValue => {
  const ctx = useContext(EstimateFormContext);
  if (!ctx) {
    throw new Error(
      'useEstimateFormContext must be used within an EstimateFormProvider',
    );
  }
  return ctx;
};

export { EstimateFormProvider, useEstimateFormContext };
