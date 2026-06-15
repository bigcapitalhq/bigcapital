// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';

import { useResourceViews, useResourceMeta, useEstimates } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

// Estimates list context.
const EstimatesListContext = createContext();

/**
 * Sale estimates data provider.
 */
function EstimatesListProvider({ query, tableStateChanged, ...props }) {
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
    data: estimatesData,
    isLoading: isEstimatesLoading,
    isFetching: isEstimatesFetching,
  } = useEstimates(query, { placeholderData: (previousData) => previousData });

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    !isEstimatesLoading && !tableStateChanged && isEmpty(estimatesData?.data);

  // Provider payload.
  const provider = {
    estimates: estimatesData?.data,
    pagination: estimatesData?.pagination,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
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
