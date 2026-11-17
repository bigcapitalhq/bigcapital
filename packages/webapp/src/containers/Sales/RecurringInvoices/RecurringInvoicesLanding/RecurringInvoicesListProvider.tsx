import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { TableQuery } from '@/store/store.types';
import { DashboardInsider } from '@/components';
import {
  useRecurringInvoices,
  useResourceMeta,
  useResourceViews,
  useSettingsInvoices,
} from '@/hooks/query';
import { transformTableStateToQuery, getFieldsFromResourceMeta } from '@/utils';

type UseRecurringInvoicesResult = ReturnType<typeof useRecurringInvoices>;
type UseResourceViewsResult = ReturnType<typeof useResourceViews>;
type UseResourceMetaResult = ReturnType<typeof useResourceMeta>;

type RecurringInvoicesListContextValue = {
  recurringInvoicesViews: UseResourceViewsResult['data'];
  recurringInvoices:
    | NonNullable<UseRecurringInvoicesResult['data']>['data']
    | undefined;
  pagination:
    | NonNullable<UseRecurringInvoicesResult['data']>['pagination']
    | undefined;
  fields: ReturnType<typeof getFieldsFromResourceMeta> | [];
  resourceMeta: UseResourceMetaResult['data'];
  isViewsLoading: boolean;
  isRecurringInvoicesLoading: boolean;
  isRecurringInvoicesFetching: boolean;
  isResourceMetaLoading: boolean;
  isEmptyStatus: boolean;
  invoicesSettings: ReturnType<typeof useSettingsInvoices>['data'];
};

type RecurringInvoicesListProviderProps = {
  tableState: Partial<TableQuery>;
  tableStateChanged: boolean;
  children?: React.ReactNode;
};

const RecurringInvoicesListContext = createContext<
  RecurringInvoicesListContextValue | undefined
>(undefined);

function RecurringInvoicesListProvider({
  tableState,
  tableStateChanged,
  children,
}: RecurringInvoicesListProviderProps) {
  const tableQuery = transformTableStateToQuery(tableState);

  const { data: invoicesSettings } = useSettingsInvoices();
  const { data: recurringInvoicesViews, isLoading: isViewsLoading } =
    useResourceViews('recurring_invoices');
  const { data: resourceMeta, isLoading: isResourceMetaLoading } =
    useResourceMeta('recurring_invoices');

  const {
    data: recurringInvoicesData,
    isLoading: isRecurringInvoicesLoading,
    isFetching: isRecurringInvoicesFetching,
  } = useRecurringInvoices(tableQuery as any);

  const isEmptyStatus =
    isEmpty(recurringInvoicesData?.data) &&
    !isRecurringInvoicesLoading &&
    !tableStateChanged;

  const state: RecurringInvoicesListContextValue = {
    recurringInvoicesViews,
    recurringInvoices: recurringInvoicesData?.data,
    pagination: recurringInvoicesData?.pagination,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isViewsLoading,
    isRecurringInvoicesLoading,
    isRecurringInvoicesFetching,
    isResourceMetaLoading,
    isEmptyStatus,
    invoicesSettings,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'recurring-invoices-list'}
    >
      <RecurringInvoicesListContext.Provider value={state}>
        {children}
      </RecurringInvoicesListContext.Provider>
    </DashboardInsider>
  );
}

const useRecurringInvoicesListContext =
  (): RecurringInvoicesListContextValue => {
    const ctx = React.useContext(RecurringInvoicesListContext);
    if (!ctx) {
      throw new Error(
        'useRecurringInvoicesListContext must be used within RecurringInvoicesListProvider',
      );
    }
    return ctx;
  };

export { RecurringInvoicesListProvider, useRecurringInvoicesListContext };
