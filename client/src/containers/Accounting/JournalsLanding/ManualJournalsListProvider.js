import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useJournals } from 'hooks/query';
import { isTableEmptyStatus } from 'utils';

const ManualJournalsContext = createContext();

function ManualJournalsListProvider({ query, ...props }) {
  // Fetches accounts resource views and fields.
  const { data: journalsViews, isLoading: isViewsLoading } = useResourceViews(
    'manual_journals',
  );

  // Fetches the manual journals transactions with pagination meta.
  const {
    data: { manualJournals, pagination, filterMeta },
    isLoading: isManualJournalsLoading,
    isFetching: isManualJournalsFetching
  } = useJournals(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus = isTableEmptyStatus({
    data: manualJournals, pagination, filterMeta,
  }) && !isManualJournalsFetching;

  // Global state.
  const state = {
    manualJournals,
    pagination,
    journalsViews,

    isManualJournalsLoading,
    isManualJournalsFetching,
    isViewsLoading,

    isEmptyStatus
  };

  return (
    <DashboardInsider loading={isViewsLoading} name={'manual-journals'}>
      <ManualJournalsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalsContext = () => React.useContext(ManualJournalsContext);

export { ManualJournalsListProvider, useManualJournalsContext };
