import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useEstimates } from 'hooks/query';

const EstimatesListContext = createContext();

/**
 * Sale estimates data provider.
 */
function EstimatesListProvider({ query, ...props }) {
  // Fetch estimates resource views and fields.
  const { data: estimatesViews, isFetching: isViewsLoading } = useResourceViews(
    'sale_estimates',
  );

  // Fetch the estimates resource fields.
  const {
    data: estimatesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('sale_estimates');

  // Fetch estimates list according to the given custom view id.
  const {
    data: { estimates, pagination },
    isFetching: isEstimatesLoading,
  } = useEstimates(query);

  // Provider payload.
  const provider = {
    estimates,
    pagination,
    estimatesFields,
    estimatesViews,

    isEstimatesLoading,
    isFieldsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'sale_estimate'}
    >
      <EstimatesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimatesListContext = () => React.useContext(EstimatesListContext);

export { EstimatesListProvider, useEstimatesListContext };
