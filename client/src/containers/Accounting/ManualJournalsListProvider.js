import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useJournals } from 'hooks/query';

const ManualJournalsContext = createContext();

function ManualJournalsListProvider({ query, ...props }) {
  // Fetches accounts resource views and fields.
  const { data: journalsViews, isFetching: isViewsLoading } = useResourceViews(
    'manual_journals',
  );

  // Fetches the manual journals transactions with pagination meta.
  const {
    data: { manualJournals },
    isFetching: isManualJournalsLoading,
  } = useJournals(query);

  // Global state.
  const state = {
    manualJournals,
    journalsViews,

    isManualJournalsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider loading={isViewsLoading} name={'manual-journals'}>
      <ManualJournalsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalsContext = () => React.useContext(ManualJournalsContext);

export { ManualJournalsListProvider, useManualJournalsContext };
