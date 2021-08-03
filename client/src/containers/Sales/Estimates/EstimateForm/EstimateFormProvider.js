import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useEstimate,
  useCustomers,
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
function EstimateFormProvider({ estimateId, ...props }) {
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

  // Handle fetch settings.
  useSettingsEstimates();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Create and edit estimate form.
  const { mutateAsync: createEstimateMutate } = useCreateEstimate();
  const { mutateAsync: editEstimateMutate } = useEditEstimate();

  const isNewMode = !estimateId;

  // Provider payload.
  const provider = {
    estimateId,
    estimate,
    items,
    customers,
    isNewMode,

    isItemsFetching,
    isEstimateFetching,

    isCustomersLoading,
    isItemsLoading,
    isEstimateLoading,

    submitPayload,
    setSubmitPayload,

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
