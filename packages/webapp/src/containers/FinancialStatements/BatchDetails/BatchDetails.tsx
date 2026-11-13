import React from 'react';
import { BatchDetailsActionsBar } from './BatchDetailsActionsBar';
import { BatchDetailsBody } from './BatchDetailsBody';
import { BatchDetailsFilters } from './BatchDetailsFilters';
import { BatchDetailsProvider } from './BatchDetailsProvider';
import { useBatchDetailsQuery } from './utils';
import { DashboardPageContent, FinancialStatement } from '@/components';

interface BatchDetailsFilterValues {
  itemsIds: number[];
  status: string;
  search: string;
}

/**
 * Batch details report.
 */
export function BatchDetails() {
  const { query, setLocationQuery } = useBatchDetailsQuery();

  const handleFilterSubmit = (values: BatchDetailsFilterValues) => {
    setLocationQuery({
      itemsIds: values.itemsIds ?? [],
      status: values.status || undefined,
      search: values.search || undefined,
    });
  };

  return (
    <BatchDetailsProvider query={query}>
      <BatchDetailsActionsBar />
      <DashboardPageContent>
        <FinancialStatement>
          <BatchDetailsFilters
            initialValues={query}
            onSubmit={handleFilterSubmit}
          />
          <BatchDetailsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </BatchDetailsProvider>
  );
}
