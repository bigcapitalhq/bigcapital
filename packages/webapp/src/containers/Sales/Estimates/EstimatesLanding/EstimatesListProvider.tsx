import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { EstimateTableRow } from './components';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useEstimates,
  useSettingsEstimates,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

interface EstimatesListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface EstimatesListContextValue {
  estimates: EstimateTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  fields: IResourceField[];
  estimatesViews: any;
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  isEstimatesLoading: boolean;
  isEstimatesFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
  estimatesSettings: SettingsGroup | undefined;
}

const EstimatesListContext = createContext<EstimatesListContextValue>(
  {} as EstimatesListContextValue,
);

function EstimatesListProvider({
  query,
  tableStateChanged,
  ...props
}: EstimatesListProviderProps) {
  const { data: estimatesViews, isLoading: isViewsLoading } =
    useResourceViews('sale_estimates');

  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('sale_estimates');

  const {
    data: estimatesData,
    isLoading: isEstimatesLoading,
    isFetching: isEstimatesFetching,
  } = useEstimates(query);

  const { data: estimatesSettings } = useSettingsEstimates();

  const isEmptyStatus =
    !isEstimatesLoading && !tableStateChanged && isEmpty(estimatesData?.data);

  const provider: EstimatesListContextValue = {
    estimates: estimatesData?.data as EstimateTableRow[] | undefined,
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

    estimatesSettings,
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
