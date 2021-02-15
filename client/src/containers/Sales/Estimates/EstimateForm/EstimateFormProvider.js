import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useEstimate,
  useCustomers,
  useItems,
  useSettings,
  useCreateEstimate,
  useEditEstimate
} from 'hooks/query';

const EstimateFormContext = createContext();

/**
 * Estimate form provider.
 */
function EstimateFormProvider({ estimateId, ...props }) {
  const { data: estimate, isFetching: isEstimateFetching } = useEstimate(
    estimateId, { enabled: !!estimateId }
  );

  // Handle fetch Items data table or list
  const {
    data: { items },
    isFetching: isItemsFetching,
  } = useItems();

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isFetch: isCustomersFetching,
  } = useCustomers();

  // Handle fetch settings.
  useSettings();

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

    submitPayload,
    setSubmitPayload,

    createEstimateMutate,
    editEstimateMutate
  };

  return (
    <DashboardInsider
      loading={isCustomersFetching || isItemsFetching || isEstimateFetching}
      name={'estimate-form'}
    >
      <EstimateFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimateFormContext = () => useContext(EstimateFormContext);

export { EstimateFormProvider, useEstimateFormContext };
