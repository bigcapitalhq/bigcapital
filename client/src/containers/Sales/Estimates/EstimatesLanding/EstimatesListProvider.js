import React, { createContext } from 'react';

import DashboardInsider from 'components/Dashboard/DashboardInsider';

import { useResourceViews, useResourceMeta, useEstimates } from 'hooks/query';
import { isTableEmptyStatus, getFieldsFromResourceMeta } from 'utils';

const EstimatesListContext = createContext();

/**
 * Sale estimates data provider.
 */
function EstimatesListProvider({ query, ...props }) {
  // Fetches estimates resource views and fields.
  const { data: estimatesViews, isLoading: isViewsLoading } =
    useResourceViews('sale_estimates');

  // Fetches the estimates resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('sale_estimates');

  // Fetches estimates list according to the given custom view id.
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

    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    estimatesViews,

    isResourceLoading,
    isResourceFetching,

    isEstimatesLoading,
    isEstimatesFetching,
    isViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'sale_estimate'}
    >
      <EstimatesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimatesListContext = () => React.useContext(EstimatesListContext);

export { EstimatesListProvider, useEstimatesListContext };
