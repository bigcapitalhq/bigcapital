import { useEffect, useCallback } from 'react';
import moment from 'moment';
import { PurchasesByItemsActionsBar } from './PurchasesByItemsActionsBar';
import { PurchasesByItemsHeader } from './PurchasesByItemsHeader';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { PurchasesByItemsLoadingBar } from './components';
import { PurchasesByItemsProvider } from './PurchasesByItemsProvider';
import { PurchasesByItemsBody } from './PurchasesByItemsBody';
import { usePurchasesByItemsQuery } from './utils';
import {
  withPurchasesByItemsActions,
  WithPurchasesByItemsActionsProps,
} from './withPurchasesByItemsActions';
import { PurchasesByItemsDialogs } from './PurchasesByItemsDialogs';
import { flow } from 'fp-ts/function';

interface PurchasesByItemsProps {
  togglePurchasesByItemsFilterDrawer: WithPurchasesByItemsActionsProps['togglePurchasesByItemsFilterDrawer'];
}

/**
 * Purchases by items.
 */
function PurchasesByItemsInner({
  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,
}: PurchasesByItemsProps) {
  const { query, setLocationQuery } = usePurchasesByItemsQuery();

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
    () => () => {
      togglePurchasesByItemsFilterDrawer(false);
    },
    [togglePurchasesByItemsFilterDrawer],
  );

  return (
    <PurchasesByItemsProvider query={query}>
      <PurchasesByItemsActionsBar
        numberFormat={query.numberFormat as Record<string, unknown>}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <PurchasesByItemsLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <PurchasesByItemsHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <PurchasesByItemsBody />
        </FinancialStatement>
      </DashboardPageContent>

      <PurchasesByItemsDialogs />
    </PurchasesByItemsProvider>
  );
}

export const PurchasesByItems = flow(withPurchasesByItemsActions)(
  PurchasesByItemsInner,
);
