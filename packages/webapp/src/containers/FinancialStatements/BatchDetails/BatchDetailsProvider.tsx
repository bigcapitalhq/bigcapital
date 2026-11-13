import React, { createContext, useContext } from 'react';
import { FinancialReportPage } from '../FinancialReportPage';
import type { BatchDetailsReportQuery } from '@/hooks/query';
import { useBatchDetailsReport } from '@/hooks/query';

interface BatchDetailsContextValue {
  batchDetails: ReturnType<typeof useBatchDetailsReport>['data'];
  isLoading: boolean;
  isFetching: boolean;
  refetch: ReturnType<typeof useBatchDetailsReport>['refetch'];
  httpQuery: BatchDetailsReportQuery;
}

const BatchDetailsContext = createContext<BatchDetailsContextValue | undefined>(
  undefined,
);

interface BatchDetailsProviderProps {
  query: BatchDetailsReportQuery;
  children?: React.ReactNode;
}

function BatchDetailsProvider({ query, ...props }: BatchDetailsProviderProps) {
  const { data, isLoading, isFetching, refetch } = useBatchDetailsReport(
    query,
    {
      placeholderData: (previousData) => previousData,
    },
  );

  const provider: BatchDetailsContextValue = {
    batchDetails: data,
    isLoading,
    isFetching,
    refetch,
    httpQuery: query,
  };

  return (
    <FinancialReportPage name={'batch-details'}>
      <BatchDetailsContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useBatchDetailsContext = (): BatchDetailsContextValue => {
  const ctx = useContext(BatchDetailsContext);
  if (!ctx) {
    throw new Error('useBatchDetailsContext must be used within provider');
  }
  return ctx;
};

export { BatchDetailsProvider, useBatchDetailsContext };
