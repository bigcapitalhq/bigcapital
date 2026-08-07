import moment from 'moment';
import { useEffect, useCallback } from 'react';
import { SalesByItemsLoadingBar } from './components';
import { SalesByItemProvider } from './SalesByItemProvider';
import { SalesByItemsActionsBar } from './SalesByItemsActionsBar';
import { SalesByItemsBody } from './SalesByItemsBody';
import { SalesByItemsDialogs } from './SalesByitemsDialogs';
import { SalesByItemsHeader } from './SalesByItemsHeader';
import { useSalesByItemsQuery } from './utils';
import {
  withSalesByItemsActions,
  WithSalesByItemsActionsProps,
} from './withSalesByItemsActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface SalesByItemsProps {
  toggleSalesByItemsFilterDrawer: WithSalesByItemsActionsProps['toggleSalesByItemsFilterDrawer'];
}

/**
 * Sales by items.
 */
function SalesByItemsInner({
  // #withSalesByItemsActions
  toggleSalesByItemsFilterDrawer,
}: SalesByItemsProps) {
  const { query, setLocationQuery } = useSalesByItemsQuery();

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
    () => () => toggleSalesByItemsFilterDrawer(false),
    [toggleSalesByItemsFilterDrawer],
  );

  return (
    <SalesByItemProvider query={query}>
      <SalesByItemsActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <SalesByItemsLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <SalesByItemsHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <SalesByItemsBody />
        </FinancialStatement>
      </DashboardPageContent>

      <SalesByItemsDialogs />
    </SalesByItemProvider>
  );
}

export const SalesByItems = compose(withSalesByItemsActions)(SalesByItemsInner);
