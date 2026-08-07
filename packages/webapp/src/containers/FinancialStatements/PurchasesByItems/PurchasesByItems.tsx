import moment from 'moment';
import { useEffect, useCallback } from 'react';
import { PurchasesByItemsLoadingBar } from './components';
import { PurchasesByItemsActionsBar } from './PurchasesByItemsActionsBar';
import { PurchasesByItemsBody } from './PurchasesByItemsBody';
import { PurchasesByItemsDialogs } from './PurchasesByItemsDialogs';
import { PurchasesByItemsHeader } from './PurchasesByItemsHeader';
import { PurchasesByItemsProvider } from './PurchasesByItemsProvider';
import { usePurchasesByItemsQuery } from './utils';
import {
  withPurchasesByItemsActions,
  WithPurchasesByItemsActionsProps,
} from './withPurchasesByItemsActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

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
        numberFormat={query.numberFormat}
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

export const PurchasesByItems = compose(withPurchasesByItemsActions)(
  PurchasesByItemsInner,
);
