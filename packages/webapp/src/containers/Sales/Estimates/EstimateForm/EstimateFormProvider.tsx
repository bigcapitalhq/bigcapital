// @ts-nocheck
import React, { createContext, useContext } from 'react';

import { DashboardInsider } from '@/components/Dashboard';
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
  ISaleEstimatesStateResponse,
} from '@/hooks/query';
import { useProjects } from '@/containers/Projects/hooks';
import { useGetPdfTemplates } from '@/hooks/query/pdf-templates';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { ITEMS_FILTER_ROLES } from './utils';

interface EstimateFormProviderValues {
  saleEstimateState: ISaleEstimatesStateResponse;
  isSaleEstimateStateLoading: boolean;
}

const EstimateFormContext = createContext({} as EstimateFormProviderValues);

/**
 * Estimate form provider.
 */
function EstimateFormProvider({ query, estimateId, ...props }) {
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
    data: { items },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: ITEMS_FILTER_ROLES,
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
  } = useWarehouses(query, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Fetches the projects list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectsFeatureCan });

  // Fetches branding templates of invoice.
  const { data: brandingTemplates, isLoading: isBrandingTemplatesLoading } =
    useGetPdfTemplates({ resource: 'SaleEstimate' });

  // Fetches the sale estimate state.
  const { data: saleEstimateState, isLoading: isSaleEstimateStateLoading } =
    useGetSaleEstimatesState();

  // Handle fetch settings.
  useSettingsEstimates();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Create and edit estimate form.
  const { mutateAsync: createEstimateMutate } = useCreateEstimate();
  const { mutateAsync: editEstimateMutate } = useEditEstimate();

  const isNewMode = !estimateId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading =
    isWarehouesLoading || isBranchesLoading || isProjectsLoading;

  const isBootLoading =
    isCustomersLoading ||
    isItemsLoading ||
    isEstimateLoading ||
    isBrandingTemplatesLoading ||
    isSaleEstimateStateLoading;

  // Provider payload.
  const provider = {
    estimateId,
    estimate,
    items,
    customers,
    branches,
    warehouses,
    projects,
    isNewMode,

    isItemsFetching,
    isEstimateFetching,

    isCustomersLoading,
    isItemsLoading,
    isEstimateLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    submitPayload,
    setSubmitPayload,

    createEstimateMutate,
    editEstimateMutate,

    // Branding templates
    brandingTemplates,
    isBrandingTemplatesLoading,

    // Estimate state
    saleEstimateState,
    isSaleEstimateStateLoading,

    isBootLoading,
  };

  return <EstimateFormContext.Provider value={provider} {...props} />;
}

const useEstimateFormContext = () =>
  useContext<EstimateFormProviderValues>(EstimateFormContext);

export { EstimateFormProvider, useEstimateFormContext };
