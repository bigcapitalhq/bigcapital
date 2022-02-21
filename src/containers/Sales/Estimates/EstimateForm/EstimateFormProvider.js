import React, { createContext, useContext } from 'react';
import { isEqual, isUndefined } from 'lodash';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useEstimate,
  useCustomers,
  useWarehouses,
  useBranches,
  useItems,
  useSettingsEstimates,
  useCreateEstimate,
  useEditEstimate,
} from 'hooks/query';
import { ITEMS_FILTER_ROLES } from './utils';

const EstimateFormContext = createContext();

/**
 * Estimate form provider.
 */
function EstimateFormProvider({ estimateId, baseCurrency, ...props }) {
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
    isFetch: isCustomersFetching,
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

  // Handle fetch settings.
  useSettingsEstimates();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});
  const [selectCustomer, setSelectCustomer] = React.useState(null);

  // Create and edit estimate form.
  const { mutateAsync: createEstimateMutate } = useCreateEstimate();
  const { mutateAsync: editEstimateMutate } = useEditEstimate();

  const isNewMode = !estimateId;

  // Determines whether the warehouse and branches are loading.
  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  // Determines whether the foreign customer.
  const isForeignCustomer =
    !isEqual(selectCustomer?.currency_code, baseCurrency) &&
    !isUndefined(selectCustomer?.currency_code);

  // Provider payload.
  const provider = {
    estimateId,
    estimate,
    items,
    customers,
    branches,
    warehouses,
    isNewMode,

    isItemsFetching,
    isEstimateFetching,

    isCustomersLoading,
    isItemsLoading,
    isEstimateLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isWarehousesSuccess,
    isForeignCustomer,
    submitPayload,
    setSubmitPayload,
    selectCustomer,
    setSelectCustomer,
    baseCurrency,
    
    createEstimateMutate,
    editEstimateMutate,
  };

  return (
    <DashboardInsider
      loading={isCustomersLoading || isItemsLoading || isEstimateLoading}
      name={'estimate-form'}
    >
      <EstimateFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimateFormContext = () => useContext(EstimateFormContext);

export { EstimateFormProvider, useEstimateFormContext };
