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

const EstimateFormContext = createContext();

/**
 * Estimate form provider.
 */
function EstimateFormProvider({ estimateId, ...props }) {
  const {
    data: estimate,
    isFetching: isEstimateFetching,
  } = useEstimate(estimateId, { enabled: !!estimateId });

  // Filter all sellable items only.
  const stringifiedFilterRoles = React.useMemo(
    () =>
      JSON.stringify([
        { index: 1, fieldKey: 'sellable', value: true, condition: '&&', comparator: 'equals', },
        { index: 2, fieldKey: 'active', value: true, condition: '&&', comparator: 'equals' },
      ]),
    [],
  );

  // Handle fetch Items data table or list
  const {
    data: { items },
    isFetching: isItemsFetching,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isFetch: isCustomersFetching,
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

    submitPayload,
    setSubmitPayload,

    createEstimateMutate,
    editEstimateMutate,
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
