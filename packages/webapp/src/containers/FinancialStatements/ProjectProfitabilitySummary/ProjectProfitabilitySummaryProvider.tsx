// @ts-nocheck
import React, { createContext, useMemo, useContext } from 'react';

import FinancialReportPage from '../FinancialReportPage';
import { useProjectProfitabilitySummary } from './hooks';
import { useProjects } from '@/containers/Projects/hooks';
import { transformFilterFormToQuery } from '../common';

const ProjectProfitabilitySummaryContext = createContext();

function ProjectProfitabilitySummaryProvider({ filter, ...props }) {
  // Transforms the given filter to query.
  const query = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  // Handle fetching the items table based on the given query.
  const {
    data: projectProfitabilitySummary,
    isFetching: isProjectProfitabilitySummaryFetching,
    isLoading: isProjectProfitabilitySummaryLoading,
    refetch: refetchProjectProfitabilitySummary,
  } = useProjectProfitabilitySummary(query, { keepPreviousData: true });

  // Fetch project list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects();

  const provider = {
    projectProfitabilitySummary,
    isProjectProfitabilitySummaryFetching,
    isProjectProfitabilitySummaryLoading,
    refetchProjectProfitabilitySummary,
    projects,
    
    query,
    filter,
  };
  return (
    <FinancialReportPage name={'project-profitability-summary'}>
      <ProjectProfitabilitySummaryContext.Provider
        value={provider}
        {...props}
      />
    </FinancialReportPage>
  );
}

const useProjectProfitabilitySummaryContext = () =>
  useContext(ProjectProfitabilitySummaryContext);

export {
  ProjectProfitabilitySummaryProvider,
  useProjectProfitabilitySummaryContext,
};
