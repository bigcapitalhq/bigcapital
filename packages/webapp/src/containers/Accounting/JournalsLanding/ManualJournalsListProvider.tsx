// @ts-nocheck
import React, { createContext } from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components';
import { useResourceViews, useResourceMeta, useJournals } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const ManualJournalsContext = createContext();

function ManualJournalsListProvider({ query, tableStateChanged, ...props }) {
  // Fetches accounts resource views and fields.
  const { data: journalsViews, isLoading: isViewsLoading } =
    useResourceViews('manual_journals');

  // Fetches the manual journals transactions with pagination meta.
  const {
    data: manualJournalsData,
    isLoading: isManualJournalsLoading,
    isFetching: isManualJournalsFetching,
  } = useJournals(query, { placeholderData: (previousData) => previousData });

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('manual_journals');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(manualJournalsData?.data) &&
    !tableStateChanged &&
    !isManualJournalsLoading;

  // Global state.
  const state = {
    manualJournals: manualJournalsData?.data,
    pagination: manualJournalsData?.pagination,
    journalsViews,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],

    isManualJournalsLoading,
    isManualJournalsFetching,
    isViewsLoading,

    isEmptyStatus,
  };

  const isPageLoading = isViewsLoading || isResourceMetaLoading;

  return (
    <DashboardInsider loading={isPageLoading} name={'manual-journals'}>
      <ManualJournalsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalsContext = () => React.useContext(ManualJournalsContext);

export { ManualJournalsListProvider, useManualJournalsContext };
