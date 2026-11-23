import React from 'react';
import { BatchDetailsActionsBar } from './BatchDetailsActionsBar';
import { BatchDetailsBody } from './BatchDetailsBody';
import { BatchDetailsHeader } from './BatchDetailsHeader';
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

  const handleFilterSubmit = (values: BatchDetailsFilterValues) => {
    setLocationQuery({
      itemsIds: values.itemsIds ?? [],
      status: values.status || undefined,
      search: values.search || undefined,
    });
  };

  return (
    <BatchDetailsProvider query={query}>
      <BatchDetailsActionsBar
        isFilterDrawerOpen={isFilterDrawerOpen}
        onToggleFilterDrawer={() => setIsFilterDrawerOpen((open) => !open)}
      />
      <DashboardPageContent>
        <FinancialStatement>
          <BatchDetailsHeader
            isOpen={isFilterDrawerOpen}
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
            onClose={() => setIsFilterDrawerOpen(false)}
          />
          <BatchDetailsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </BatchDetailsProvider>
  );
}
