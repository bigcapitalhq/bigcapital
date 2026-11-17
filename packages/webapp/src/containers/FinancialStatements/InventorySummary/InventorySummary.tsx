import * as FF from 'fp-ts/function';
import moment from 'moment';
import { useEffect, useCallback } from 'react';
import { InventorySummaryLoadingBar } from './components';
import { InventorySummaryActionsBar } from './InventorySummaryActionsBar';
import { InventorySummaryBody } from './InventorySummaryBody';
import { InventorySummaryDialogs } from './InventorySummaryDialogs';
import { InventorySummaryHeader } from './InventorySummaryHeader';
import { InventorySummaryProvider } from './InventorySummaryProvider';
import { useInventorySummaryQuery } from './utils';
import {
  withInventorySummaryActions,
  WithInventorySummaryActionsProps,
} from './withInventorySummaryActions';
import { FinancialStatement, DashboardPageContent } from '@/components';

interface InventorySummaryProps {
  toggleInventorySummaryFilterDrawer: WithInventorySummaryActionsProps['toggleInventorySummaryFilterDrawer'];
}

/**
 * Inventory summary.
 */
function InventorySummaryInner({
  // #withInventorySummaryActions
  toggleInventorySummaryFilterDrawer,
}: InventorySummaryProps) {
  const { query, setLocationQuery } = useInventorySummaryQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
      };
      setLocationQuery(parsedFilter);
    },
    [setLocationQuery],
  );

  // Handle number format form submit.
  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat,
    });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => toggleInventorySummaryFilterDrawer(false),
    [toggleInventorySummaryFilterDrawer],
  );

  return (
    <InventorySummaryProvider query={query}>
      <InventorySummaryActionsBar
        numberFormat={query.numberFormat ?? {}}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventorySummaryLoadingBar />

      <DashboardPageContent>
        <FinancialStatement numberFormat={query.numberFormat ?? {}}>
          <InventorySummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <InventorySummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <InventorySummaryDialogs />
    </InventorySummaryProvider>
  );
}

export const InventorySummary = FF.pipe(
  InventorySummaryInner,
  withInventorySummaryActions,
);
