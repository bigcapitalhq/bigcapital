import React, { useEffect, useCallback } from 'react';
import moment from 'moment';

import { SalesByItemsBody } from './SalesByItemsBody';
import { SalesByItemProvider } from './SalesByItemProvider';
import { SalesByItemsLoadingBar } from './components';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { SalesByItemsActionsBar } from './SalesByItemsActionsBar';
import { SalesByItemsHeader } from './SalesByItemsHeader';

import {
  withSalesByItemsActions,
  WithSalesByItemsActionsProps,
} from './withSalesByItemsActions';

import { useSalesByItemsQuery } from './utils';
import { SalesByItemsDialogs } from './SalesByitemsDialogs';
import { flow } from 'fp-ts/function';

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
        numberFormat={query.numberFormat as Record<string, unknown>}
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

export const SalesByItems = flow(withSalesByItemsActions)(
  SalesByItemsInner,
);
