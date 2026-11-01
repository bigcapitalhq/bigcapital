import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { BillTableRow } from './components';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useBills,
  useSettingsBills,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

interface BillsListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface BillsListContextValue {
  bills: BillTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  billsViews: any;
  resourceMeta: any;
  fields: IResourceField[];
  billSettings: SettingsGroup | undefined;
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  isBillsLoading: boolean;
  isBillsFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
}

const BillsListContext = createContext<BillsListContextValue>(
  {} as BillsListContextValue,
);

function BillsListProvider({
  query,
  tableStateChanged,
  ...props
}: BillsListProviderProps) {
  const { data: billsViews, isLoading: isViewsLoading } =
    useResourceViews('bills');

  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('bills');

  const {
    data: billsData,
    isLoading: isBillsLoading,
    isFetching: isBillsFetching,
  } = useBills(query);

  const { data: billSettings } = useSettingsBills();

  const isEmptyStatus =
    isEmpty(billsData?.data) && !isBillsLoading && !tableStateChanged;

  const provider: BillsListContextValue = {
    bills: billsData?.data,
    pagination: billsData?.pagination,
    billsViews,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    billSettings,
    isResourceLoading,
    isResourceFetching,

    isBillsLoading,
    isBillsFetching,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'bills'}
    >
      <BillsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBillsListContext = () => React.useContext(BillsListContext);

export { BillsListProvider, useBillsListContext };
