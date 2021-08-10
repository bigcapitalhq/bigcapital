import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceMeta, useJournals } from 'hooks/query';
import { isTableEmptyStatus, getFieldsFromResourceMeta } from 'utils';

const ManualJournalsContext = createContext();

function ManualJournalsListProvider({ query, ...props }) {
  // Fetches accounts resource views and fields.
  const { data: journalsViews, isLoading: isViewsLoading } =
    useResourceViews('manual_journals');

  // Fetches the manual journals transactions with pagination meta.
  const {
    data: { manualJournals, pagination, filterMeta },
    isLoading: isManualJournalsLoading,
    isFetching: isManualJournalsFetching,
  } = useJournals(query, { keepPreviousData: true });

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('manual_journals');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isTableEmptyStatus({
      data: manualJournals,
      pagination,
      filterMeta,
    }) && !isManualJournalsFetching;

  // Global state.
  const state = {
    manualJournals,
    pagination,
    journalsViews,

    resourceMeta,
    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    isManualJournalsLoading,
    isManualJournalsFetching,
    isViewsLoading,

    isEmptyStatus,
  };

  const isPageLoading =
    isManualJournalsLoading || isViewsLoading || isResourceMetaLoading;

  return (
    <DashboardInsider loading={isPageLoading} name={'manual-journals'}>
      <ManualJournalsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalsContext = () => React.useContext(ManualJournalsContext);

export { ManualJournalsListProvider, useManualJournalsContext };
