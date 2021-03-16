import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useEstimates } from 'hooks/query';
import { isTableEmptyStatus } from 'utils';

const EstimatesListContext = createContext();

/**
 * Sale estimates data provider.
 */
function EstimatesListProvider({ query, ...props }) {
  // Fetches estimates resource views and fields.
  const { data: estimatesViews, isLoading: isViewsLoading } = useResourceViews(
    'sale_estimates',
  );

  // Fetches the estimates resource fields.
  const {
    data: estimatesFields,
    isLoading: isFieldsLoading,
  } = useResourceFields('sale_estimates');

  // Fetch estimates list according to the given custom view id.
  const {
    data: { estimates, pagination, filterMeta },
    isLoading: isEstimatesLoading,
    isFetching: isEstimatesFetching,
  } = useEstimates(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: estimates,
      pagination,
      filterMeta,
    }) && !isEstimatesFetching;

  // Provider payload.
  const provider = {
    estimates,
    pagination,
    estimatesFields,
    estimatesViews,

    isEstimatesLoading,
    isEstimatesFetching,
    isFieldsLoading,
    isViewsLoading,

    isEmptyStatus,
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
