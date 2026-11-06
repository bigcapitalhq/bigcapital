import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { TableQuery } from '@/store/store.types';
import { DashboardInsider } from '@/components';
import {
  useRecurringJournals,
  useResourceMeta,
  useResourceViews,
  useSettingsManualJournals,
} from '@/hooks/query';
import { transformTableStateToQuery, getFieldsFromResourceMeta } from '@/utils';

type UseRecurringJournalsResult = ReturnType<typeof useRecurringJournals>;
type UseResourceViewsResult = ReturnType<typeof useResourceViews>;
type UseResourceMetaResult = ReturnType<typeof useResourceMeta>;

type RecurringJournalsListContextValue = {
  recurringJournalsViews: UseResourceViewsResult['data'];
  recurringJournals:
    | NonNullable<UseRecurringJournalsResult['data']>['data']
    | undefined;
  pagination:
    | NonNullable<UseRecurringJournalsResult['data']>['pagination']
    | undefined;
  fields: ReturnType<typeof getFieldsFromResourceMeta> | [];
  resourceMeta: UseResourceMetaResult['data'];
  isViewsLoading: boolean;
  isRecurringJournalsLoading: boolean;
  isRecurringJournalsFetching: boolean;
  isResourceMetaLoading: boolean;
  isEmptyStatus: boolean;
  manualJournalsSettings: ReturnType<typeof useSettingsManualJournals>['data'];
};

type RecurringJournalsListProviderProps = {
  tableState: Partial<TableQuery>;
  tableStateChanged: boolean;
  children?: React.ReactNode;
};

const RecurringJournalsListContext = createContext<
  RecurringJournalsListContextValue | undefined
>(undefined);

function RecurringJournalsListProvider({
  tableState,
  tableStateChanged,
  children,
}: RecurringJournalsListProviderProps) {
  const tableQuery = transformTableStateToQuery(tableState);

  const { data: manualJournalsSettings } = useSettingsManualJournals();
  const { data: recurringJournalsViews, isLoading: isViewsLoading } =
    useResourceViews('recurring_journals');
  const { data: resourceMeta, isLoading: isResourceMetaLoading } =
    useResourceMeta('recurring_journals');

  const {
    data: recurringJournalsData,
    isLoading: isRecurringJournalsLoading,
    isFetching: isRecurringJournalsFetching,
  } = useRecurringJournals(tableQuery as any);

  const isEmptyStatus =
    isEmpty(recurringJournalsData?.data) &&
    !isRecurringJournalsLoading &&
    !tableStateChanged;

  const state: RecurringJournalsListContextValue = {
    recurringJournalsViews,
    recurringJournals: recurringJournalsData?.data,
    pagination: recurringJournalsData?.pagination,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    isViewsLoading,
    isRecurringJournalsLoading,
    isRecurringJournalsFetching,
    isResourceMetaLoading,
    isEmptyStatus,
    manualJournalsSettings,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'recurring-journals-list'}
    >
      <RecurringJournalsListContext.Provider value={state}>
        {children}
      </RecurringJournalsListContext.Provider>
    </DashboardInsider>
  );
}

const useRecurringJournalsListContext =
  (): RecurringJournalsListContextValue => {
    const ctx = React.useContext(RecurringJournalsListContext);
    if (!ctx) {
      throw new Error(
        'useRecurringJournalsListContext must be used within RecurringJournalsListProvider',
      );
    }
    return ctx;
  };

export { RecurringJournalsListProvider, useRecurringJournalsListContext };
